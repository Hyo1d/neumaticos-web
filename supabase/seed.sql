insert into brands (slug, name, logo_url) values
  ('green-trac', 'Greentrac', '/brand-logos/greentrac-local.png'),
  ('michelin', 'Michelin', '/brand-logos/michelin.svg'),
  ('firestone', 'Firestone', '/brand-logos/firestone-local.svg'),
  ('giti', 'Giti', '/brand-logos/giti-local.png'),
  ('bridgestone', 'Bridgestone', '/brand-logos/bridgestone-local.svg'),
  ('pirelli', 'Pirelli', '/brand-logos/pirelli-cropped.png'),
  ('goodyear', 'Goodyear', '/brand-logos/goodyear-local.svg'),
  ('bf-goodrich', 'BFGoodrich', '/brand-logos/bf-goodrich-cropped.png'),
  ('fate', 'Fate', '/brand-logos/fate-local.png'),
  ('wanli', 'Wanli', '/brand-logos/extra-local.png')
on conflict (slug) do update set name = excluded.name, logo_url = excluded.logo_url, is_active = true;

insert into categories (slug, name, icon) values
  ('auto', 'Auto', 'Car'),
  ('suv', 'SUV', 'Badge'),
  ('camionetas', 'Camionetas', 'Truck'),
  ('deportivo', 'Deportivo', 'Gauge')
on conflict (slug) do update set name = excluded.name, icon = excluded.icon, is_active = true;

with brand_ids as (
  select slug, id from brands
), category_ids as (
  select slug, id from categories
)
insert into products (
  slug, name, brand_id, category_id, description, width, aspect_ratio, rim_size,
  load_index, speed_rating, price, price_compare, stock, images, tags, is_featured, is_active
) values
  (
    'green-trac-quest-x-185-65-r15',
    'Quest-X 185/65 R15',
    (select id from brand_ids where slug = 'green-trac'),
    (select id from category_ids where slug = 'auto'),
    'Neumatico equilibrado para uso urbano y ruta, con buen agarre y respuesta diaria.',
    185, 65, 15, '88', 'H', 129900, 151000, 12,
    array['/fantini-hero-tires.png'], array['urbano','ruta','precio contado'], true, true
  ),
  (
    'michelin-primacy-4-205-55-r16',
    'Primacy 4 205/55 R16',
    (select id from brand_ids where slug = 'michelin'),
    (select id from category_ids where slug = 'auto'),
    'Cubierta premium enfocada en seguridad, durabilidad y adherencia constante durante su vida util.',
    205, 55, 16, '91', 'V', 238500, null, 8,
    array['/fantini-hero-tires.png'], array['premium','seguridad'], true, true
  ),
  (
    'bridgestone-dueler-225-65-r17',
    'Dueler H/T 225/65 R17',
    (select id from brand_ids where slug = 'bridgestone'),
    (select id from category_ids where slug = 'suv'),
    'Diseno para SUV con conduccion estable, buen confort y desempeno confiable en asfalto.',
    225, 65, 17, '102', 'H', 289000, null, 5,
    array['/fantini-hero-tires.png'], array['suv','confort'], true, true
  ),
  (
    'firestone-f600-175-70-r13',
    'F600 175/70 R13',
    (select id from brand_ids where slug = 'firestone'),
    (select id from category_ids where slug = 'auto'),
    'Opcion confiable para autos compactos, con gran relacion precio-prestacion.',
    175, 70, 13, '82', 'T', 88900, null, 20,
    array['/fantini-hero-tires.png'], array['compacto','oferta'], false, true
  )
on conflict (slug) do update set
  name = excluded.name,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  description = excluded.description,
  width = excluded.width,
  aspect_ratio = excluded.aspect_ratio,
  rim_size = excluded.rim_size,
  load_index = excluded.load_index,
  speed_rating = excluded.speed_rating,
  price = excluded.price,
  price_compare = excluded.price_compare,
  stock = excluded.stock,
  images = excluded.images,
  tags = excluded.tags,
  is_featured = excluded.is_featured,
  is_active = excluded.is_active;

insert into site_config (key, value) values
  ('general', '{"site_name":"Fantini Neumaticos","phone":"03525-608906","whatsapp":"3525 503984","email":"fantini_neumaticos@hotmail.com","address":"Pedro J. Frias (norte) 307 - Jesus Maria"}'),
  ('promo_messages', '["Los mejores precios en neumaticos","6 cuotas sin interes","Precio especial por transferencia","Alineado y balanceado","Llantas deportivas","Retiro en sucursal"]'),
  ('hero_slides', '[{"eyebrow":"Stock real en Jesus Maria","title":"Cubiertas para cada camino","text":"Elegi por medida y recibi asesoramiento para tu auto, SUV o camioneta.","cta":"Ver catalogo","href":"/catalogo","image":"/fantini/photos/stock-hero.webp","imageAlt":"Deposito de neumaticos de Fantini"},{"eyebrow":"Taller propio","title":"Instalacion y servicio completo","text":"Alineado, balanceado, reparacion y trabajo profesional sobre tu vehiculo.","cta":"Pedir turno","href":"https://wa.me/5493525503984","image":"/fantini/photos/taller-hero.webp","imageAlt":"Taller de Fantini Neumaticos en funcionamiento"},{"eyebrow":"Primeras marcas","title":"Asesoramiento que se ve","text":"Comparamos opciones y medidas para que elijas el neumatico correcto.","cta":"Consultar ahora","href":"https://wa.me/5493525503984","image":"/fantini/photos/showroom-hero.webp","imageAlt":"Exhibicion de neumaticos en Fantini"}]'),
  ('shipping', '{"free_shipping_threshold":250000,"flat_rate":12000,"enabled":true,"branches":["Sucursal Centro"]}'),
  ('payment', '{"mercadopago_enabled":false,"tarjetas_enabled":true,"transferencia_enabled":true,"efectivo_enabled":false}')
on conflict (key) do update set value = excluded.value;
