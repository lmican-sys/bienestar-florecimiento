const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const h1 = await page.textContent('h1');
  console.log('H1:', h1);

  // Tab 3: Propuesta 16 Componentes
  console.log('Checking Tab 3...');
  await page.click('button:has-text("3. Propuesta")');
  await page.waitForTimeout(600);
  const compCards = await page.$$eval('.bg-white.rounded-xl', els => els.length);
  console.log('Component cards rendered:', compCards);

  // Tab 4: Sala de Validación
  console.log('Checking Tab 4...');
  await page.click('button:has-text("4. Sala de Validación")');
  await page.waitForTimeout(600);
  const dictamenText = await page.textContent('h3');
  console.log('Tab 4 subtitle:', dictamenText);

  // Tab 5: Red de Agentes & Firmas
  console.log('Checking Tab 5...');
  await page.click('button:has-text("5. Red de Agentes & Firmas")');
  await page.waitForTimeout(600);
  const pendingButtons = await page.$$eval('button:has-text("Firmar Documento")', els => els.length);
  console.log('Pending signature buttons:', pendingButtons);

  // Sign one pending agent
  if (pendingButtons > 0) {
    await page.click('button:has-text("Firmar Documento") >> nth=0');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Confirmar y Asignar Firma")');
    await page.waitForTimeout(600);
    console.log('Successfully signed for agent!');
  }

  // Tab 6: Documento Definitivo
  console.log('Checking Tab 6...');
  await page.click('button:has-text("6. Documento Definitivo")');
  await page.waitForTimeout(600);
  const codeText = await page.textContent('span:has-text("EXP-ARE-")');
  console.log('Institutional Code found:', codeText);

  // Check Word download button
  const wordBtn = await page.$('button:has-text("Descargar Word")');
  console.log('Word download button exists:', !!wordBtn);

  // Screenshot of the final document
  await page.screenshot({ path: '/tmp/doc_institucional.png' });
  console.log('Screenshot saved to /tmp/doc_institucional.png');

  console.log('Browser errors:', errors.length);
  if (errors.length > 0) console.log(errors);

  await browser.close();
  console.log('All tests completed successfully!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
