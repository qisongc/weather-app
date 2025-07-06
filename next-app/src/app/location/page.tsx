import Image from "next/image";

const fetchAPI = async () => {
  try {
    const response = await fetch("http://python-app:8000/counter", {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return JSON.stringify(await response.json());
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}


export default function Page() {
  return (
    <div className="">
      {fetchAPI()}
    </div>
  );
}
