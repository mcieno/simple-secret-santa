export type Draw = {
    code: string
    from: string
    to: string
}

export async function getDraws(): Promise<Draw[]> {
    const response = await fetch('pairs.json')

    let draws = await response.json() as Draw[]

    draws.forEach(draw => {
        draw.to = new TextDecoder().decode(
            Uint8Array.from(
                atob(draw.to), c => c.codePointAt(0)!
            )
        )
    })

    return draws
}
