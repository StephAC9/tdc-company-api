exports.handler = async (event) => {
  try {
    const term = event.queryStringParameters.term;

    if (!term) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing term parameter" })
      };
    }

    const apiUrl = `https://tdc.dk/api/cvr/checkcvrlite?term=${encodeURIComponent(term)}&searchMaxSize=10`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Upstream API failed" })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,

      // ✅ CORS FIX
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET"
      },

      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("CVR PROXY ERROR:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
};
