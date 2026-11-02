<template>
  <svg class="ellipsoid-separation" viewBox="0 0 390 144" role="img" aria-label="楕円体法の模式図。中心で分離し、実行可能領域を含む側を残して、より体積の小さい楕円体で包む。">
    <!-- For a central cut in 2D, these ellipses use the exact update:
         center shifts by -a/3, radii become 2a/3 and 2b/sqrt(3).
         Thus the new ellipse contains the entire retained half ellipse. -->
    <path d="M130 22 A96 48 0 0 0 130 118 Z" fill="#edf2fb" />
    <path d="M45 64 L59 49 L83 48 L98 65 L81 89 L54 84 Z" fill="#afc3e4" fill-opacity="0.7" />
    <text x="9" y="11" fill="#64748b">実行可能領域</text>
    <path d="M78 15 L74 47" fill="none" stroke="#64748b" stroke-width="1" />
    <ellipse cx="130" cy="70" rx="96" ry="48" fill="none" stroke="#8694ae" stroke-width="1.6" stroke-dasharray="5 4" />
    <ellipse cx="98" cy="70" rx="64" ry="55.426" fill="none" stroke="#1c3177" stroke-width="2.4" />
    <line x1="130" y1="11" x2="130" y2="128" stroke="#b42318" stroke-width="1.7" />
    <circle cx="130" cy="70" r="3.5" fill="#b42318" />
    <path d="M137 69 L180 49" fill="none" stroke="#b42318" stroke-width="1" />
    <text x="183" y="48" fill="#b42318">検査する中心</text>
    <text x="167" y="101" fill="#64748b">除ける側</text>
    <path d="M227 69 L253 69 M247 64 L253 69 L247 74" fill="none" stroke="#64748b" stroke-width="1.5" />
    <text x="262" y="57" fill="#1c3177">残る側を包む</text>
    <text x="262" y="80" fill="#1c3177">楕円体へ更新</text>
    <text x="42" y="140" fill="#1c3177">青：次の楕円体</text>
    <text x="191" y="140" fill="#64748b">破線：現在の楕円体</text>
  </svg>
</template>

<style scoped>
.ellipsoid-separation { width: 100%; height: auto; display: block; }
text { font-family: inherit; font-size: 13px; font-weight: 500; }
</style>
