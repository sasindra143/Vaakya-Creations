/**
 * heroData.js
 * 10 slides — one per category — for Vaakya Creations hero carousel.
 * Images: Unsplash curated Indian-fashion / ethnic-wear photography.
 * Each slide has: id, slug (matches CategoryPage route), badge, titleLine1,
 * titleLine2, subtitle, image, alt, category, mobileImage (portrait crop).
 */

const heroSlides = [
  /* ── 1. Pattu Sarees ── */
  {
    id:          "pattu-sarees",
    slug:        "pattu-sarees",
    category:    "Pattu Sarees",
    badge:       "Heritage Weaves",
    titleLine1:  "Royal",
    titleLine2:  "Pattu Sarees",
    subtitle:    "Handwoven Kanjivaram silk sarees that carry centuries of Dravidian artistry — each thread a story of golden grandeur.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934676/pexels-daredevil-32536129_fyex7t.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771933130/photo-1641699862936-be9f49b1c38d_gdryu2.avif",
    alt:         "A woman draped in a vibrant Kanjivaram pattu saree with gold zari border",
    accent:      "#c9a84c",
  },

  /* ── 2. Fancy Sarees ── */
  {
    id:          "fancy-sarees",
    slug:        "fancy-sarees",
    category:    "Fancy Sarees",
    badge:       "New Arrivals",
    titleLine1:  "Contemporary",
    titleLine2:  "Fancy Sarees",
    subtitle:    "Where tradition meets the runway — georgette, chiffon and net sarees reimagined for the modern celebration.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934572/pexels-lalyphotos-karthi-926242842-29805067_s4xkxu.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934572/pexels-lalyphotos-karthi-926242842-29805067_s4xkxu.jpg",
    alt:         "Model wearing a flowing fancy georgette saree in jewel tones",
    accent:      "#e8a0bf",
  },

  /* ── 3. Silk Sarees ── */
  {
    id:          "silk-sarees",
    slug:        "silk-sarees",
    category:    "Silk Sarees",
    badge:       "Pure Luxury",
    titleLine1:  "Timeless",
    titleLine2:  "Silk Sarees",
    subtitle:    "Pure silk that drapes like poetry — banarasi, mysore and tussar weaves destined to become heirlooms.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934829/pexels-anastasia-shuraeva-8750030_jlrfrj.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934829/pexels-anastasia-shuraeva-8750030_jlrfrj.jpg",
    alt:         "Luxurious deep-red silk saree with intricate gold border detail",
    accent:      "#c9a84c",
  },

  /* ── 4. Kurtis ── */
  {
    id:          "kurtis",
    slug:        "kurtis",
    category:    "Kurtis",
    badge:       "Everyday Elegance",
    titleLine1:  "Effortless",
    titleLine2:  "Kurtis",
    subtitle:    "Printed, embroidered and mirror-work kurtis crafted for women who move with grace — from morning meetings to evening soirées.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934998/pexels-qazi-1246421_zldnia.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771934998/pexels-qazi-1246421_zldnia.jpg",
    alt:         "Woman in a vibrant printed kurti with flowing silhouette",
    accent:      "#7bc8a4",
  },

  /* ── 5. Dresses ── */
  {
    id:          "dresses",
    slug:        "dresses",
    category:    "Dresses",
    badge:       "Indo-Western",
    titleLine1:  "Fusion",
    titleLine2:  "Dresses",
    subtitle:    "Indo-western dresses that blur boundaries — layered anarkali cuts and flared silhouettes made for the fearless.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771935295/vuhoangno7-woman-8182795_1920_hxueml.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771935295/vuhoangno7-woman-8182795_1920_hxueml.jpg",
    alt:         "Indo-western fusion dress with embroidered detailing on a model",
    accent:      "#a78bfa",
  },

  /* ── 6. Tops ── */
  {
    id:          "tops",
    slug:        "tops",
    category:    "Tops",
    badge:       "Versatile Styles",
    titleLine1:  "Statement",
    titleLine2:  "Tops",
    subtitle:    "Block-print, bandhani and embellished tops that transform any outfit — pair with palazzos, denim or lehengas.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771217490/imana-9cWnh9nGBPI-unsplash_noahhb.jpg",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771217490/imana-9cWnh9nGBPI-unsplash_noahhb.jpg",
    alt:         "Colorful ethnic printed top on a fashion model",
    accent:      "#fb923c",
  },

  /* ── 7. Blouses ── */
  {
    id:          "blouses",
    slug:        "blouses",
    category:    "Blouses",
    badge:       "Artisan Crafted",
    titleLine1:  "Exquisite",
    titleLine2:  "Blouses",
    subtitle:    "Hand-embroidered, zardosi and mirror-work blouses — the secret jewel that completes your saree story.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771933296/photo-1604247618324-3656e0c5b24b_kymxwu.avif",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771933296/photo-1604247618324-3656e0c5b24b_kymxwu.avif",
    alt:         "Ornate hand-embroidered silk blouse with gold zardosi work",
    accent:      "#c9a84c",
  },

  /* ── 8. Handmade Jewellery ── */
  {
    id:          "handmade-jewellery",
    slug:        "handmade-jewellery",
    category:    "Handmade Jewellery",
    badge:       "Artisan Collection",
    titleLine1:  "Handcrafted",
    titleLine2:  "Jewellery",
    subtitle:    "Temple-gold, oxidised silver and beaded creations born in artisan ateliers — adornments with a living soul.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771152309/shopping_qzpnsg.webp",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771152309/shopping_qzpnsg.webp",
    alt:         "Handcrafted gold temple jewellery set with intricate detailing",
    accent:      "#fbbf24",
  },

  /* ── 9. Lehengas ── */
  {
    id:          "lehengas",
    slug:        "lehengas",
    category:    "Lehengas",
    badge:       "Bridal & Festive",
    titleLine1:  "Dreamy",
    titleLine2:  "Lehengas",
    subtitle:    "Heavily embellished, couture-quality lehengas for the most luminous moments — weddings, sangeets and grand festivities.",
    image:       "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771936154/cvi1c_512_psjxz6.avif",
    mobileImage: "https://res.cloudinary.com/dvknx0hpm/image/upload/v1771936154/cvi1c_512_psjxz6.avif",
    alt:         "Bridal lehenga choli with heavy zari embroidery in deep crimson",
    accent:      "#f43f5e",
  },

  /* ── 10. Anarkali Suits ── */
  {
    id:          "anarkali-suits",
    slug:        "anarkali-suits",
    category:    "Anarkali Suits",
    badge:       "Regal Silhouettes",
    titleLine1:  "Majestic",
    titleLine2:  "Anarkali Suits",
    subtitle:    "Floor-sweeping anarkali suits in brocade, velvet and georgette — silhouettes fit for royalty redefined for today.",
    image:       "https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=1920&q=90&auto=format&fit=crop",
    mobileImage: "https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=900&q=90&auto=format&fit=crop&crop=center",
    alt:         "Model in a sweeping floor-length anarkali suit with dupatta",
    accent:      "#818cf8",
  },
];

export default heroSlides;