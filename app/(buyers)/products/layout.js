"use client";

export default function ProductsLayout({ children }) {
        return (
                <div className="products-layout">
                        <div className="products-content">{children}</div>
                </div>
        );
}
