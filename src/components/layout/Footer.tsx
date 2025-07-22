export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="durian-footer">
      <div className="container">
        <div className="durian-footer-content">
          <div className="durian-footer-brand">
            <span className="durian-footer-title">榴莲工具</span>
            <span className="durian-footer-subtitle">实用工具聚合平台</span>
          </div>
          <div className="durian-footer-copyright">
            <p>&copy; {currentYear} 榴莲工具. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
