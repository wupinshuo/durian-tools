export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="durian-footer">
      <div className="container">
        <div className="durian-footer-content">
          <p className="durian-footer-text">
            榴莲工具 © {currentYear} - 实用工具聚合平台
          </p>
        </div>
      </div>
    </footer>
  );
}
