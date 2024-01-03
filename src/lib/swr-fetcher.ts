const SwrFetcher = async (url: string) => {
  const response = await fetch(url, { cache: "reload" });

  if (!response.ok) {
    throw new Error("Falha ao buscar dados");
  }

  return response.json();
};

export default SwrFetcher;
