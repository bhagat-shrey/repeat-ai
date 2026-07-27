import { useRef, useEffect } from 'react'

interface HeroProps {
  trustBadge?: {
    text: string
    icons?: string[]
  }
  headline: {
    line1: string
    line2: string
  }
  subtitle: string
  buttons?: {
    primary?: {
      text: string
      onClick?: () => void
    }
    secondary?: {
      text: string
      onClick?: () => void
    }
  }
  stats?: {
    value: string
    label: string
  }[]
  image?: {
    src: string
    alt: string
    caption?: {
      title: string
      line: string
      note: string
    }
  }
  className?: string
}

const defaultShaderSource = `#version 300 es
/*********
* made by Matthias Hurrle (@atzedent)
*
*	To explore strange new worlds, to seek out new life
*	and new civilizations, to boldly go where no man has
*	gone before.
*/
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p) {
  p=fract(p*vec2(12.9898,78.233));
  p+=dot(p,p+34.56);
  return fract(p.x*p.y);
}
float noise(in vec2 p) {
  vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
  float
  a=rnd(i),
  b=rnd(i+vec2(1,0)),
  c=rnd(i+vec2(0,1)),
  d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);
}
float fbm(vec2 p) {
  float t=.0, a=1.; mat2 m=mat2(1.,-.5,.2,1.2);
  for (int i=0; i<5; i++) {
    t+=a*noise(p);
    p*=2.*m;
    a*=.5;
  }
  return t;
}
float clouds(vec2 p) {
	float d=1., t=.0;
	for (float i=.0; i<3.; i++) {
		float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);
		t=mix(t,d,a);
		d=a;
		p*=2./(i+1.);
	}
	return t;
}
void main(void) {
	vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
	vec3 col=vec3(0);
	float bg=clouds(vec2(st.x+T*.5,-st.y));
	uv*=1.-.3*(sin(T*.2)*.5+.5);
	for (float i=1.; i<12.; i++) {
		uv+=.1*cos(i*vec2(.1+.01*i, .8)+i*i+T*.5+.1*uv.x);
		vec2 p=uv;
		float d=length(p);
		col+=.00125/d*(cos(sin(i)*vec3(1,2,3))+1.);
		float b=noise(i+p+bg*1.731);
		col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
		col=mix(col,vec3(bg*.05,bg*.25,bg*.12),d);
	}
	O=vec4(col,1);
}`

class WebGLRenderer {
  private canvas: HTMLCanvasElement
  private gl: WebGL2RenderingContext
  private program: WebGLProgram | null = null
  private vs: WebGLShader | null = null
  private fs: WebGLShader | null = null
  private buffer: WebGLBuffer | null = null
  private shaderSource: string
  private mouseMove = [0, 0]
  private mouseCoords = [0, 0]
  private pointerCoords = [0, 0]
  private nbrOfPointers = 0

  private vertexSrc = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

  private vertices = [-1, 1, -1, -1, 1, 1, 1, -1]

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas
    this.gl = canvas.getContext('webgl2')!
    this.gl.viewport(0, 0, canvas.width * scale, canvas.height * scale)
    this.shaderSource = defaultShaderSource
  }

  updateShader(source: string) {
    this.reset()
    this.shaderSource = source
    this.setup()
    this.init()
  }

  updateMove(deltas: number[]) {
    this.mouseMove = deltas
  }

  updateMouse(coords: number[]) {
    this.mouseCoords = coords
  }

  updatePointerCoords(coords: number[]) {
    this.pointerCoords = coords
  }

  updatePointerCount(nbr: number) {
    this.nbrOfPointers = nbr
  }

  updateScale(scale: number) {
    this.gl.viewport(0, 0, this.canvas.width * scale, this.canvas.height * scale)
  }

  compile(shader: WebGLShader, source: string) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader)
      console.error('Shader compilation error:', error)
    }
  }

  test(source: string) {
    let result: string | null = null
    const gl = this.gl
    const shader = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      result = gl.getShaderInfoLog(shader)
    }
    gl.deleteShader(shader)
    return result
  }

  reset() {
    const gl = this.gl
    if (this.program && !gl.getProgramParameter(this.program, gl.DELETE_STATUS)) {
      if (this.vs) {
        gl.detachShader(this.program, this.vs)
        gl.deleteShader(this.vs)
      }
      if (this.fs) {
        gl.detachShader(this.program, this.fs)
        gl.deleteShader(this.fs)
      }
      gl.deleteProgram(this.program)
    }
  }

  setup() {
    const gl = this.gl
    this.vs = gl.createShader(gl.VERTEX_SHADER)!
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)!
    this.compile(this.vs, this.vertexSrc)
    this.compile(this.fs, this.shaderSource)
    this.program = gl.createProgram()!
    gl.attachShader(this.program, this.vs)
    gl.attachShader(this.program, this.fs)
    gl.linkProgram(this.program)

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(this.program))
    }
  }

  init() {
    const gl = this.gl
    const program = this.program!

    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)

    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).resolution =
      gl.getUniformLocation(program, 'resolution')
    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).time =
      gl.getUniformLocation(program, 'time')
    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).move =
      gl.getUniformLocation(program, 'move')
    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).touch =
      gl.getUniformLocation(program, 'touch')
    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).pointerCount =
      gl.getUniformLocation(program, 'pointerCount')
    ;(program as WebGLProgram & Record<string, WebGLUniformLocation | null>).pointers =
      gl.getUniformLocation(program, 'pointers')
  }

  render(now = 0) {
    const gl = this.gl
    const program = this.program

    if (!program || gl.getProgramParameter(program, gl.DELETE_STATUS)) return

    const uniforms = program as WebGLProgram & Record<string, WebGLUniformLocation | null>

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)

    gl.uniform2f(uniforms.resolution, this.canvas.width, this.canvas.height)
    gl.uniform1f(uniforms.time, now * 1e-3)
    gl.uniform2f(uniforms.move, this.mouseMove[0], this.mouseMove[1])
    gl.uniform2f(uniforms.touch, this.mouseCoords[0], this.mouseCoords[1])
    gl.uniform1i(uniforms.pointerCount, this.nbrOfPointers)
    gl.uniform2fv(uniforms.pointers, this.pointerCoords)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

class PointerHandler {
  private scale: number
  private active = false
  private pointers = new Map<number, number[]>()
  private lastCoords = [0, 0]
  private moves = [0, 0]

  constructor(element: HTMLCanvasElement, scale: number) {
    this.scale = scale

    const map = (el: HTMLCanvasElement, s: number, x: number, y: number) => [
      x * s,
      el.height - y * s,
    ]

    element.addEventListener('pointerdown', (e) => {
      this.active = true
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
    })

    element.addEventListener('pointerup', (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first
      }
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })

    element.addEventListener('pointerleave', (e) => {
      if (this.count === 1) {
        this.lastCoords = this.first
      }
      this.pointers.delete(e.pointerId)
      this.active = this.pointers.size > 0
    })

    element.addEventListener('pointermove', (e) => {
      if (!this.active) return
      this.lastCoords = [e.clientX, e.clientY]
      this.pointers.set(e.pointerId, map(element, this.getScale(), e.clientX, e.clientY))
      this.moves = [this.moves[0] + e.movementX, this.moves[1] + e.movementY]
    })
  }

  getScale() {
    return this.scale
  }

  updateScale(scale: number) {
    this.scale = scale
  }

  get count() {
    return this.pointers.size
  }

  get move() {
    return this.moves
  }

  get coords() {
    return this.pointers.size > 0 ? Array.from(this.pointers.values()).flat() : [0, 0]
  }

  get first() {
    return this.pointers.values().next().value || this.lastCoords
  }
}

const useShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const rendererRef = useRef<WebGLRenderer | null>(null)
  const pointersRef = useRef<PointerHandler | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const dpr = Math.max(1, 0.5 * window.devicePixelRatio)

    const resize = () => {
      if (!canvasRef.current) return
      const c = canvasRef.current
      const scale = Math.max(1, 0.5 * window.devicePixelRatio)
      c.width = window.innerWidth * scale
      c.height = window.innerHeight * scale
      rendererRef.current?.updateScale(scale)
    }

    const loop = (now: number) => {
      if (!rendererRef.current || !pointersRef.current) return
      rendererRef.current.updateMouse(pointersRef.current.first)
      rendererRef.current.updatePointerCount(pointersRef.current.count)
      rendererRef.current.updatePointerCoords(pointersRef.current.coords)
      rendererRef.current.updateMove(pointersRef.current.move)
      rendererRef.current.render(now)
      animationFrameRef.current = requestAnimationFrame(loop)
    }

    rendererRef.current = new WebGLRenderer(canvas, dpr)
    pointersRef.current = new PointerHandler(canvas, dpr)

    rendererRef.current.setup()
    rendererRef.current.init()

    resize()

    if (rendererRef.current.test(defaultShaderSource) === null) {
      rendererRef.current.updateShader(defaultShaderSource)
    }

    loop(0)
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      rendererRef.current?.reset()
    }
  }, [])

  return canvasRef
}

const Hero = ({
  trustBadge,
  headline,
  subtitle,
  buttons,
  stats,
  image,
  className = '',
}: HeroProps) => {
  const canvasRef = useShaderBackground()

  return (
    <div
      className={`relative flex min-h-screen w-full items-center overflow-hidden bg-black ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none object-contain"
        style={{ background: 'black' }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/35 to-black/70" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-2 lg:gap-16">
        <div className="animate-fade-in-up text-white">
          {trustBadge && (
            <div className="mb-6 animate-fade-in-down">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium backdrop-blur-md md:text-sm">
                {trustBadge.icons && (
                  <div className="flex gap-1">
                    {trustBadge.icons.map((icon, index) => (
                      <span key={index} className="text-emerald-300">
                        {icon}
                      </span>
                    ))}
                  </div>
                )}
                <span className="text-emerald-100">{trustBadge.text}</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <h1 className="font-display animate-fade-in-up animation-delay-200 text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl">
              {headline.line1}
            </h1>
            <h1 className="font-display animate-fade-in-up animation-delay-400 bg-gradient-to-r from-emerald-300 via-lime-300 to-teal-200 bg-clip-text text-5xl font-semibold leading-[1.05] tracking-tight text-transparent md:text-6xl lg:text-7xl">
              {headline.line2}
            </h1>
          </div>

          <p className="animate-fade-in-up animation-delay-600 mt-6 max-w-xl text-lg leading-relaxed text-emerald-50/85 md:text-xl">
            {subtitle}
          </p>

          {buttons && (
            <div className="animate-fade-in-up animation-delay-800 mt-8 flex flex-wrap gap-3">
              {buttons.primary && (
                <button
                  type="button"
                  onClick={buttons.primary.onClick}
                  className="rounded-full bg-gradient-to-r from-emerald-500 to-lime-500 px-8 py-3.5 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:from-emerald-400 hover:to-lime-400 hover:shadow-xl hover:shadow-emerald-500/25"
                >
                  {buttons.primary.text}
                </button>
              )}
              {buttons.secondary && (
                <button
                  type="button"
                  onClick={buttons.secondary.onClick}
                  className="rounded-full border border-emerald-300/30 bg-emerald-500/10 px-8 py-3.5 text-base font-semibold text-emerald-100 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-emerald-300/50 hover:bg-emerald-500/20"
                >
                  {buttons.secondary.text}
                </button>
              )}
            </div>
          )}

          {stats && stats.length > 0 && (
            <dl className="animate-fade-in-up animation-delay-800 mt-10 grid max-w-md grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-2xl font-semibold text-emerald-300 md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs text-emerald-100/70">{stat.label}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {image && (
          <div className="animate-fade-in-up animation-delay-400 relative">
            <div className="absolute inset-0 -rotate-3 rounded-3xl bg-gradient-to-br from-emerald-400/30 to-lime-300/20 opacity-60 blur-2xl" />
            <img
              src={image.src}
              alt={image.alt}
              className="relative aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl shadow-emerald-950/40"
            />
            {image.caption && (
              <div className="absolute -bottom-5 -left-3 hidden rounded-2xl border border-white/15 bg-black/70 p-4 shadow-xl backdrop-blur-md md:block md:-left-4">
                <p className="text-xs text-emerald-100/70">{image.caption.title}</p>
                <p className="font-display text-lg font-semibold text-white">{image.caption.line}</p>
                <p className="text-xs text-emerald-300">{image.caption.note}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
