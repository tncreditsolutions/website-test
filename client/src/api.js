export async function analyzePDF(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData
  });

  return res.json();
}