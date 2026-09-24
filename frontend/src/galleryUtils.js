const MIN_GALLERY_ITEMS = 11;

export function ensureGalleryPhotoSlots(content) {
  const items = content?.home?.gallery?.items;
  if (!Array.isArray(items) || items.length >= MIN_GALLERY_ITEMS) return content;

  const emptySlots = Array.from({ length: MIN_GALLERY_ITEMS - items.length }, (_, index) => ({
    title: `New school photo ${items.length + index + 1}`,
    image: "",
    imageAlt: "",
  }));

  return {
    ...content,
    home: {
      ...content.home,
      gallery: {
        ...content.home.gallery,
        items: [...items, ...emptySlots],
      },
    },
  };
}
