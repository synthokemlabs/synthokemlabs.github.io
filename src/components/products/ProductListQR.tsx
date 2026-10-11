import { ScanQR } from "@/components/ui/ScanQR";
import { SITE } from "@/data/site";

/**
 * The QR from the Product List cover, shown in the header of every product listing page and in
 * each product page's hero, so the code on screen and on paper is the same.
 */
export function ProductListQR({
  layout = "auto", size = 148, className = "w-full lg:w-[264px]",
}: { layout?: "stack" | "row" | "auto"; size?: number; className?: string }) {
  return (
    <div className={className}>
      <ScanQR
        layout={layout}
        size={size}
        title="Scan for the product list"
        label={SITE.productListName}
        sub={`PDF · ${SITE.productListSize}`}
        src={SITE.productListQr}
        alt={`QR code for the ${SITE.productListName}`}
        href={SITE.productListPdf}
        hrefLabel="Open PDF"
        download="synthokem-product-list-qr.png"
      />
    </div>
  );
}
