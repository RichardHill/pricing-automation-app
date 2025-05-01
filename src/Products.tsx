import { useState } from "react";

export default function PricingForm() {
  const [formData, setFormData] = useState<{
    productName: string;
    competitorPrice: number;
    costBase: string;
    targetMargin: string;
    productCategory: string;
    suggestedPrice: number | null;
    grossMargin: number | null;
    summary: string;
  }>({
    productName: "Sample Product",
    competitorPrice: 19.99,
    costBase: "",
    targetMargin: "",
    productCategory: "",
    suggestedPrice: null,
    grossMargin: null,
    summary: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e :any) => {
    e.preventDefault();
    const cost = parseFloat(formData.costBase);
    const margin = parseFloat(formData.targetMargin) / 100;
    const suggested = cost * (1 + margin);
    const gross = ((suggested - cost) / suggested) * 100;

    setFormData((prev) => ({
      ...prev,
      suggestedPrice: suggested,
      grossMargin: gross,
      summary: `Based on competitor pricing and your target margin, a suggested price of $${suggested.toFixed(2)} maximizes profitability while remaining competitive. Gross margin is estimated at ${gross.toFixed(2)}%.`
    }));

    // TODO: Save to spreadsheet & optionally call LLM
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", fontFamily: "sans-serif" }}>
      <h2>Pricing Recommendation Form</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          Product Name:
          <input name="productName" value={formData.productName} readOnly />
        </label>
        <label>
          Competitor Price:
          <input name="competitorPrice" value={formData.competitorPrice} readOnly />
        </label>
        <label>
          Cost Base:
          <input name="costBase" type="number" value={formData.costBase} onChange={handleChange} required />
        </label>
        <label>
          Target Margin (%):
          <input name="targetMargin" type="number" value={formData.targetMargin} onChange={handleChange} required />
        </label>
        <label>
          Product Category:
          <input name="productCategory" value={formData.productCategory} onChange={handleChange} />
        </label>
        <button type="submit">Calculate Recommendation</button>
      </form>

      {formData.suggestedPrice !== null && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>Recommendation Summary</h3>
          <p>Suggested Price: ${formData.suggestedPrice.toFixed(2)}</p>
          <p>Gross Margin: {formData.grossMargin?.toFixed(2)}%</p>
          <p><strong>CFO Review:</strong> {formData.summary}</p>
        </div>
      )}
    </div>
  );
}