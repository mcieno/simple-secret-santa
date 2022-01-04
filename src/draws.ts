export type Draw = {
    code: string
    from: string
    to: string
}

export async function getDraws(): Promise<Draw[]> {
    const response = await fetch('pairs.json')

    let draws = await response.json() as Draw[]

    draws.forEach(draw => { draw.to = atob(draw.to) })

    return draws
}
