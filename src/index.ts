import { html, render } from "lit-html";
import data from "../data.json" assert { type: "json" };

const defaultLocaleFormatter = new Intl.NumberFormat();

// Unique regions sorted:
const regions = [...new Set(data.map(country => country.region))]
  .filter(Boolean) // In case any region is an empty string
  .sort();

const state = {
  searchTerm: "",
  selectedRegion: null as string | null,
  detailCountry: null as any,
  data: null as any[] | null,
  get filterCountries() {
    return this.selectedRegion && this.searchTerm
      ? country => filterRegion(country) && filterTerm(country)
      : this.selectedRegion
        ? filterRegion
        : this.searchTerm
          ? filterTerm
          : () => true;
  },
};

const filterTerm = country =>
  country.name.toLowerCase().includes(state.searchTerm);
const filterRegion = country => country.region === state.selectedRegion;

const allCountries = () => state.data || data;
const selectedCountries = () => allCountries().filter(state.filterCountries);
const countryByCode = (() => {
  let origin: any[] | null = null;
  let cache = new Map<string, any>();

  return () => {
    const currentData = allCountries();
    if (currentData !== origin || cache.size === 0) {
      origin = currentData;
      cache.clear();
      currentData.forEach(c => cache.set(c.alpha3Code, c));
    }
    return cache;
  };
})();

function toggleTheme() {
  if (document.body.hasAttribute("data-theme")) {
    document.body.removeAttribute("data-theme");
  } else {
    document.body.setAttribute("data-theme", "dark");
  }
}

function countryCardHtml(country) {
  return html`<div
    class="country-card"
    @click=${() => (state.detailCountry = country)}
  >
    <img src=${country.flag} class="country-flag" />
    <div class="details-text-container">
      <h2 class="country-name">${country.name}</h2>
      <p class="info">
        <span class="label">Population:</span>
        <span class="value">
          ${defaultLocaleFormatter.format(country.population)}
        </span>
      </p>
      <p class="info">
        <span class="label">Region:</span>
        <span class="value">${country.region}</span>
      </p>
      <p class="info">
        <span class="label">Capital:</span>
        <span class="value">${country.capital}</span>
      </p>
    </div>
  </div>`;
}

// SVG from heroicons
const headerHtml = () =>
  html` <header class="topbar">
    <h1 class="left">Where in the world?</h1>
    <button class="right theme-switcher" @click=${toggleTheme}>
      <span style="display:flex;gap: 0.5rem">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          width="18"
          height="18"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
        Dark Mode
      </span>
    </button>
  </header>`;

function homeHtml() {
  return html`
    ${headerHtml()}
    <main class="container">
      <form class="input-container">
        <div class="search-input-wrapper">
          <!-- Search Icon -->
          <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="18"
            height="18"
          >
            <path
              d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"
            ></path>
          </svg>
          <input
            type="search"
            placeholder="Search for a country..."
            .value=${state.searchTerm}
            @input=${e => (state.searchTerm = e.target.value.toLowerCase())}
            class="search-input"
          />
        </div>
        <div class="filter-wrapper">
          <select
            class="filter-select"
            @change=${e => (state.selectedRegion = e.target.value)}
          >
            <option value="">
              ${state.selectedRegion ? "All Regions" : "Filter by Region"}
            </option>
            ${regions.map(region => html`<option>${region}</option>`)}
          </select>
        </div>
      </form>
      <div class="countries-grid">
        ${selectedCountries().map(countryCardHtml)}
      </div>
    </main>
  `;
}

const borderCountryHtml = country =>
  html`<button
    class="border-country"
    @click=${() => (state.detailCountry = country)}
  >
    ${country.name}
  </button>`;

function borderCountriesHtml(country) {
  if (!country.borders || country.borders.length === 0) return null;
  const byCode = countryByCode();
  return html` <div class="border-countries">
    <h3 class="label">Border Countries:</h3>
    <div class="border-countries-container">
      ${country.borders.map(code => borderCountryHtml(byCode.get(code)))}
    </div>
  </div>`;
}

function detailHtml(country) {
  return html`${headerHtml()}
    <main class="container">
      <button class="back-button" @click=${() => (state.detailCountry = null)}>&larr;&nbsp; Back</button>
      <div class="country-details">
        <img src=${country.flag} class="country-flag" />
        <div class="details-text-container">
          <h2 class="country-name">${country.name}</h2>
          <div class="details-grid">
            <div>
              <p class="info">
                <span class="label">Native Name:</span>
                <span class="value">${country.nativeName}</span>
              </p>
              <p class="info">
                <span class="label">Population:</span>
                <span class="value"
                  >${defaultLocaleFormatter.format(country.population)}</span
                >
              </p>
              <p class="info">
                <span class="label">Region:</span>
                <span class="value">${country.region}</span>
              </p>
              <p class="info">
                <span class="label">Sub Region:</span>
                <span class="value">${country.subregion}</span>
              </p>
              <p class="info">
                <span class="label">Capital:</span>
                <span class="value">${country.capital}</span>
              </p>
            </div>
            <div>
              <p class="info">
                <span class="label">Top Level Domain:</span>
                <span class="value">${country.topLevelDomain.join(", ")}</span>
              </p>
              <p class="info">
                <span class="label">Currencies:</span>
                <span class="value">${country.currencies
                  .map(currency => currency.name)
                  .join(", ")}</span
                >
              </span>
              </p>
              <p class="info">
                <span class="label">Languages:</span>
                <span class="value">${country.languages
                  .map(language => language.name)
                  .join(", ")}</span>
              </p>
            </div>
          </div>   
           ${borderCountriesHtml(country)}
        </div>
      </div>
    </main>`;
}

const renderBody = () =>
  render(
    state.detailCountry ? detailHtml(state.detailCountry) : homeHtml(),
    document.body
  );
renderBody();
window.onclick = window.oninput = window.onchange = renderBody;
