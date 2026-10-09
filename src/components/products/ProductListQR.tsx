import { ScanQR } from "@/components/ui/ScanQR";
import { SITE } from "@/data/site";

/** "Scan for the product list" QR, shown in the header of every product listing page. */
export function ProductListQR() {
  return (
    <div className="w-full lg:w-[264px]">
      <ScanQR
        layout="auto"
        size={148}
        title="Scan for the product list"
        label={SITE.productListName}
        sub={`PDF · ${SITE.productListSize}`}
        path={SITE.productListPdf}
        fileName="synthokem-product-list-qr"
      />
    </div>
  );
}
