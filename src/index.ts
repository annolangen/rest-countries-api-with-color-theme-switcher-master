import { html, render } from "lit-html";
import data from "../data.json" assert { type: "json" };

const defaultLocaleFormatter = new Intl.NumberFormat();

function countryCardHtml(country) {
  return html`<div class="country-card">
    <img src=${country.flags.svg} class="country-flag" />
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

function homeHtml() {
  return html`
    <header class="topbar">
      <h1 class="left">Where in the world?</h1>
      <button class="right theme-switcher">🌙 Dark Mode</button>
    </header>
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
            class="search-input"
          />
        </div>
        <button type="button" class="filter-button">Filter by Region</button>
      </form>
      <div class="countries-grid">${data.map(countryCardHtml)}</div>
    </main>
  `;
}

const renderBody = () => render(homeHtml(), document.body);
renderBody();
window.onclick = window.oninput = renderBody;
