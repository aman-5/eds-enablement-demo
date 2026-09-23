/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the WKND site nav fragment (served at /nav).
 * Produces the 3-section structure the EDS header block expects:
 *   Section 1 (brand):    logo link -> /us/en
 *   Section 2 (sections): top-level nav list (Magazine, Adventures, FAQs, About Us)
 *   Section 3 (tools):    Search / Sign In links
 * The header block classifies children as nav-brand / nav-sections / nav-tools by order.
 */
export default function parse(element, { document }) {
  const main = document.body;
  main.innerHTML = '';

  // --- Section 1: brand (logo) ---
  const brand = document.createElement('div');
  const brandP = document.createElement('p');
  const brandLink = document.createElement('a');
  brandLink.href = '/us/en';
  brandLink.textContent = 'WKND';
  brandP.append(brandLink);
  brand.append(brandP);

  // --- Section 2: sections (nav menu) ---
  const sections = document.createElement('div');
  const ul = document.createElement('ul');
  const items = [
    ['Magazine', '/us/en/magazine'],
    ['Adventures', '/us/en/adventures'],
    ['FAQs', '/us/en/faqs'],
    ['About Us', '/us/en/about-us'],
  ];
  items.forEach(([label, href]) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    li.append(a);
    ul.append(li);
  });
  sections.append(ul);

  // --- Section 3: tools ---
  const tools = document.createElement('div');
  const toolsP = document.createElement('p');
  const signIn = document.createElement('a');
  signIn.href = '/us/en';
  signIn.textContent = 'Sign In';
  toolsP.append(signIn);
  tools.append(toolsP);

  main.append(brand, sections, tools);
}
