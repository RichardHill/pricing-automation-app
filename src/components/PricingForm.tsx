import React, { useEffect, useState } from "react";
import "./PricingForm.css";

type Product = {
  name: string;
  price: number;
  rating?: string;
};

type FormState = {
  productName: string;
  competitorPrice: number;
  rating?: string;
  costBase: number;
  targetMargin: number;
};

const cleanPrice = (priceStr: string): number => {
  const match = priceStr.match(/[\d,.]+/);
  return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
};

const PricingForm = () => {
  const [productData, setProductData] = useState<Product[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [formState, setFormState] = useState<FormState>({
    productName: "",
    competitorPrice: 0,
    rating: "",
    costBase: 0,
    targetMargin: 0,
  });

  useEffect(() => {
    fetch("/data/scraped-data.json")
      .then((res) => res.json())
      .then((raw: any[]) => {
        const cleaned = raw
          .filter((item) => item.name && item.price)
          .map((item) => ({
            name: item.name.trim(),
            price: cleanPrice(item.price),
            rating: item.rating || "",
          }));
        setProductData(cleaned);
        if (cleaned.length > 0) {
          setFormState((prev) => ({
            ...prev,
            productName: cleaned[0].name,
            competitorPrice: cleaned[0].price,
            rating: cleaned[0].rating,
          }));
        }
      });
  }, []);

  useEffect(() => {
    const selected = productData[selectedIndex];
    if (selected) {
      setFormState((prev) => ({
        ...prev,
        productName: selected.name,
        competitorPrice: selected.price,
        rating: selected.rating,
      }));
    }
  }, [selectedIndex, productData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: name === "costBase" || name === "targetMargin" ? parseFloat(value) : value,
    }));
  };

  return (
    <form className="pricing-form" onSubmit={(e) => e.preventDefault()}>
      <h2>Pricing Form</h2>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="productSelect">Choose Product:</label>
        </div>
        <div className="form-field">
          <select
            id="productSelect"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {productData.map((p, i) => (
              <option key={i} value={i}>
                {p.name.slice(0, 80)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="productName">Product Name:</label>
        </div>
        <div className="form-field">
          <input type="text" id="productName" name="productName" value={formState.productName} readOnly />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="competitorPrice">Competitor Price:</label>
        </div>
        <div className="form-field">
          <input type="number" id="competitorPrice" name="competitorPrice" value={formState.competitorPrice} readOnly />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="rating">Rating:</label>
        </div>
        <div className="form-field">
          <input type="text" id="rating" name="rating" value={formState.rating} readOnly />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="costBase">Cost Base:</label>
        </div>
        <div className="form-field">
          <input type="number" id="costBase" name="costBase" value={formState.costBase} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <div className="form-label">
          <label htmlFor="targetMargin">Target Margin (%):</label>
        </div>
        <div className="form-field">
          <input
            type="number"
            id="targetMargin"
            name="targetMargin"
            value={formState.targetMargin}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

export default PricingForm;