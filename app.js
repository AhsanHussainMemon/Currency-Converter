const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const result = document.getElementById("result");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");

const countries = {
  USD: "us", PKR: "pk", EUR: "eu", GBP: "gb", INR: "in",
  AUD: "au", CAD: "ca", JPY: "jp", CNY: "cn", AED: "ae",
  SAR: "sa", TRY: "tr", NZD: "nz", CHF: "ch", MYR: "my",
  THB: "th", SGD: "sg", ZAR: "za", KRW: "kr", RUB: "ru",
  NOK: "no", SEK: "se", DKK: "dk", HKD: "hk", IDR: "id",
  PHP: "ph", EGP: "eg", NGN: "ng", MXN: "mx", BRL: "br",
  BDT: "bd", LKR: "lk", KWD: "kw", QAR: "qa"
};

const API_KEY = "6b49f297fced705c95d54000";

function populateDropdowns() {
  for (let code in countries) {
    fromCurrency.add(new Option(code, code));
    toCurrency.add(new Option(code, code));
  }
  fromCurrency.value = "USD";
  toCurrency.value = "PKR";
  updateFlag(fromFlag, fromCurrency.value);
  updateFlag(toFlag, toCurrency.value);
}

function updateFlag(img, currency) {
  img.src = `https://flagcdn.com/48x36/${countries[currency].toLowerCase()}.png`;
}

fromCurrency.addEventListener("change", () => updateFlag(fromFlag, fromCurrency.value));
toCurrency.addEventListener("change", () => updateFlag(toFlag, toCurrency.value));

async function convertCurrency() {
  const amount = parseFloat(document.getElementById("amount").value);
  if (!amount || amount <= 0) {
    result.innerHTML = "<span style='color: #f00;'>Please enter a valid amount!</span>";
    return;
  }
  const from = fromCurrency.value;
  const to = toCurrency.value;
  const url = `https://v6.exchangerate-api.com/v6/6b49f297fced705c95d54000/latest/${from}`;


  try {
    result.textContent = "Converting...";
    const res = await fetch(url);
    const data = await res.json();

    if (data.conversion_rates && data.conversion_rates[to]) {
      const rate = data.conversion_rates[to];
      const converted = (amount * rate).toFixed(2);
      result.innerHTML = `<br><strong>${amount} ${from} = ${converted} ${to}</strong>`;
    } else {
      result.innerHTML = "<span style='color: #f00;'>Conversion failed. Try again.</span>";
    }
  } catch (error) {
    result.innerHTML = "<span style='color: #f00;'>Error fetching data. Check connection.</span>";
    console.error(error);
  }
}

// Swap currencies and flags
swapBtn.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateFlag(fromFlag, fromCurrency.value);
  updateFlag(toFlag, toCurrency.value);

  // Also convert instantly after swapping
  convertCurrency();
});

convertBtn.addEventListener("click", (e) => {
  e.preventDefault();
  convertCurrency();
});

populateDropdowns();
