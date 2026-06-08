// Fallback "studio render" used when a car has no uploaded photos yet.
const CABIN: Record<string,string> = {
  suv: "M-150,-38 L-150,-150 Q-150,-166 -132,-166 L150,-166 Q168,-166 168,-150 L160,-38 Z",
  sedan: "M-150,-38 L-100,-130 Q-92,-142 -72,-142 L70,-142 Q150,-140 162,-60 L160,-38 Z",
  coupe: "M-160,-38 Q-110,-128 -10,-130 L40,-130 Q150,-126 165,-38 Z",
  hatch: "M-150,-38 L-120,-138 Q-112,-150 -92,-150 L90,-150 Q150,-146 158,-50 L150,-38 Z",
};
const GLASS: Record<string,string> = {
  suv: "M-132,-56 L-132,-150 Q-132,-156 -126,-156 L150,-156 L150,-56 Z",
  sedan: "M-118,-56 L-86,-128 Q-80,-136 -66,-136 L66,-136 Q140,-134 150,-66 L150,-56 Z",
  coupe: "M-140,-54 Q-100,-120 -12,-122 L38,-122 Q140,-118 152,-54 Z",
  hatch: "M-128,-54 L-104,-130 Q-98,-140 -84,-140 L86,-140 Q140,-136 148,-60 L148,-54 Z",
};
export function placeholder(label = "Car", body = "sedan", paint = "#39414c") {
  const cab = CABIN[body] || CABIN.sedan, gls = GLASS[body] || GLASS.sedan;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='900' height='560' viewBox='0 0 900 560'>
  <defs><linearGradient id='bg' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a3056'/><stop offset='1' stop-color='#0a1426'/></linearGradient>
  <radialGradient id='spot' cx='50%' cy='40%' r='55%'><stop offset='0' stop-color='#2a456f' stop-opacity='.85'/><stop offset='1' stop-color='#0a1426' stop-opacity='0'/></radialGradient>
  <linearGradient id='sheen' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#fff' stop-opacity='.22'/><stop offset='.5' stop-color='#fff' stop-opacity='0'/></linearGradient></defs>
  <rect width='900' height='560' fill='url(#bg)'/><rect width='900' height='560' fill='url(#spot)'/>
  <ellipse cx='450' cy='470' rx='250' ry='26' fill='${paint}' opacity='.14'/>
  <g transform='translate(450,330)'>
  <path d='${cab}' fill='${paint}'/>
  <path d='M-255,25 C-250,-15 -220,-35 -160,-40 L160,-40 C220,-35 250,-15 255,25 C257,45 250,55 232,55 L-232,55 C-250,55 -257,45 -255,25 Z' fill='${paint}'/>
  <path d='${gls}' fill='#0c1730' opacity='.6'/>
  <path d='M-255,25 C-250,-15 -220,-35 -160,-40 L160,-40 C220,-35 250,-15 255,25 C257,40 252,46 240,46 L-240,46 C-252,46 -257,40 -255,25 Z' fill='url(#sheen)'/>
  <circle cx='-150' cy='50' r='48' fill='#11151c'/><circle cx='-150' cy='50' r='24' fill='#b7bcc4'/><circle cx='-150' cy='50' r='9' fill='#5c626c'/>
  <circle cx='155' cy='50' r='48' fill='#11151c'/><circle cx='155' cy='50' r='24' fill='#b7bcc4'/><circle cx='155' cy='50' r='9' fill='#5c626c'/>
  </g>
  <text x='450' y='520' text-anchor='middle' font-family='sans-serif' font-size='19' font-weight='600' fill='#aeb8cc'>${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
