import { cn } from '@/lib/utils'

type Palette = Record<string, string>

function PixelSprite({
  grid,
  palette,
  size = 4,
  className,
  label,
}: {
  grid: string[]
  palette: Palette
  size?: number
  className?: string
  label?: string
}) {
  const h = grid.length
  const w = grid[0].length
  return (
    <svg
      width={w * size}
      height={h * size}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      className={cn('block', className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {grid.flatMap((row, y) =>
        row.split('').map((c, x) =>
          palette[c] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={palette[c]} /> : null,
        ),
      )}
    </svg>
  )
}

const HERO = [
  '...YYYYY...',
  '..YYYYYYY..',
  '..KKSSSKK..',
  '..SSKSKSS..',
  '..SSSSSSS..',
  '...SSSSS...',
  '..GGBGGBG..',
  '.GGGBBBGGG.',
  '.SSBBYBBSS.',
  '...BBBBB...',
  '...BB.BB...',
  '..KKK.KKK..',
]

export function GuardianHero({ size = 4, className }: { size?: number; className?: string }) {
  return (
    <PixelSprite
      grid={HERO}
      size={size}
      className={className}
      label="City Guardian hero"
      palette={{ Y: '#fbbf24', K: '#14101f', S: '#f4c28f', G: '#2fa84f', B: '#1e4fd8' }}
    />
  )
}

const MUSHROOM = [
  '...RRRR...',
  '..RWWRRR..',
  '.RRWWRRWR.',
  'RRRRRRWWRR',
  'RWWRRRRRRR',
  'RWWRRRRWWR',
  '..CCCCCC..',
  '..CKCCKC..',
  '..CCCCCC..',
  '...CCCC...',
]

export function Mushroom({ size = 4, className }: { size?: number; className?: string }) {
  return (
    <PixelSprite
      grid={MUSHROOM}
      size={size}
      className={className}
      palette={{ R: '#e52521', W: '#ffffff', C: '#fdf6e3', K: '#14101f' }}
    />
  )
}

const STAR = [
  '....Y....',
  '...YYY...',
  'YYYYYYYYY',
  '.YYKYKYY.',
  '..YYYYY..',
  '.YYY.YYY.',
  'YY.....YY',
]

export function PowerStar({ size = 4, className }: { size?: number; className?: string }) {
  return <PixelSprite grid={STAR} size={size} className={className} palette={{ Y: '#fbbf24', K: '#14101f' }} />
}

const CASTLE = [
  'K.K.K....K.K.K',
  'KKKKK....KKKKK',
  '.KGK......KGK.',
  '.KGKK.KK.KKGK.',
  '.KGGKKKKKKGGK.',
  '.KGGGGGGGGGGK.',
  '.KGGGKKKKGGGK.',
  '.KGGK....KGGK.',
  '.KKKK....KKKK.',
]

export function Castle({ size = 4, className }: { size?: number; className?: string }) {
  return <PixelSprite grid={CASTLE} size={size} className={className} palette={{ K: '#14101f', G: '#8a8fa8' }} />
}
