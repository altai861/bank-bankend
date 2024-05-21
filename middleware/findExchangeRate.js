
const USD = async () => {
    const url = "https://v6.exchangerate-api.com/v6/3e3ead4ce1f0ccb54406653e/latest/USD";
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching exchange rates: ${response.statusText}`);
        }

        const data = await response.json();
        return parseFloat(data.conversion_rates.MNT);
    } catch (error) {
        console.error(error);
    }
};



module.exports = USD;