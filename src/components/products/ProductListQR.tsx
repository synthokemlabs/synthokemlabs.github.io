import { Icon } from "@/components/ui/Icon";
import { ScanQR } from "@/components/ui/ScanQR";
import { SITE } from "@/data/site";

/** Highlighted "scan for the product list" card, shown in the header of every product listing page. */
export function ProductListQR() {
  return (
    <div className="w-full max-w-[300px] rounded-lg bg-white/95 p-5 text-text shadow-[0_30px_60px_-30px_rgb(4_30_60/0.7)] ring-1 ring-white/40">
      <p className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-strong"><Icon name="download" size={14} /> Scan for the product list</p>
      <div className="mt-4">
        <ScanQR path={SITE.productListPdf} label={`${SITE.productListName} (PDF · ${SITE.productListSize})`} fileName="synthokem-product-list-qr" size={168} />
      </div>
    </div>
  );
}
