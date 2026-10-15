<template>
  <svg viewBox="0 0 720 155" role="img" aria-label="有向3サイクル。1から2へ容量0.2、2から3へ0.3、3から1へ0.5。" class="directed-cycle">
    <defs>
      <marker id="cycle-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#1c3177" />
      </marker>
      <marker id="cycle-weak" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#b42318" />
      </marker>
    </defs>
    <path d="M 123 65 L 332 65" stroke="#b42318" stroke-width="3" marker-end="url(#cycle-weak)" />
    <path d="M 383 65 L 592 65" stroke="#1c3177" stroke-width="4" marker-end="url(#cycle-arrow)" />
    <path d="M 620 89 C 620 145 100 145 100 89" fill="none" stroke="#1c3177" stroke-width="5" marker-end="url(#cycle-arrow)" />
    <g fill="white" stroke="#1c3177" stroke-width="2">
      <circle cx="100" cy="65" r="23" /><circle cx="360" cy="65" r="23" /><circle cx="620" cy="65" r="23" />
    </g>
    <g text-anchor="middle" dominant-baseline="middle" fill="#1c3177" class="vertices">
      <text x="100" y="65">1</text><text x="360" y="65">2</text><text x="620" y="65">3</text>
    </g>
    <g text-anchor="middle" class="capacities">
      <text x="230" y="43" fill="#b42318">0.2</text>
      <text x="490" y="43" fill="#1c3177">0.3</text>
      <text x="360" y="116" fill="#1c3177">0.5</text>
    </g>
  </svg>
</template>

<style scoped>
.directed-cycle { width: 100%; height: 150px; margin: 8px auto; }
.vertices text { font-size: 19px !important; font-weight: 600; }
.capacities text { font-size: 18px !important; }
</style>
