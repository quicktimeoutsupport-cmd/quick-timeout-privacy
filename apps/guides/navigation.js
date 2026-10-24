// Carry only explicit supported campaign parameters through local guide navigation.
const query = new URLSearchParams(location.search);
document.querySelectorAll('a[href]').forEach(a => {
 const url = new URL(a.href);
 if (url.origin !== location.origin) return;
 for (const key of ['source','content','campaign','medium']) {
   const value = query.get(key);
   if (value && /^[a-z0-9_]{1,64}$/.test(value)) url.searchParams.set(key,value);
 }
 a.href = url.href;
});
