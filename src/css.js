export const mainCSS = `
.fcc_input {
  font-family: 'Lato', 'FontAwesome', sans-serif;
  min-width: 100%;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.fcc_searchBar {
  width: 100%;
  position: relative;
  display: inline-block;
}

@media (min-width: 992px) {
  .fcc_searchBar {
    width: 75%;
  }
}
`;

export const dropdownCSS = `
.dropdown-content {
  display: block;
  position: absolute;
  min-width: 100%;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border-radius: 5px;
}

.fcc_resultList {
  margin-bottom: 0px;
}

.fcc_resultItem.header {
  padding: 0px;
}

.fcc_resultItem.hasContent:hover {
  background-color: #f5f5f5
}

.fcc_resultHeading-wrap {
  background-color: #006400;
  color: #fff;
  padding-top: 5px;
  margin-left: 0;
  margin-right: 0;
}

.fcc_resultLink {
  color: inherit;
}

.fcc_resultLink:hover {
  color: inherit;
  text-decoration: none;
}

.fcc_resultContent {
  padding-top: 10px;
}

.fcc_resultHighlight {
  background-color: #ffa500;
  color: #000;
  padding: 2px 5px;
}
`;
