# Loudspeaker Interference Demo

A classroom-friendly p5.js simulation showing interference from two in-phase loudspeakers.

Students can drag the microphone and observe how the path-length difference changes the resulting pressure amplitude.

## Physics idea

For two in-phase speakers:

- Constructive interference: `Δd = mλ`
- Destructive interference: `Δd = (m + 1/2)λ`

where `Δd = |d1 - d2|` is the path-length difference.

## Run locally

Open `index.html` in a browser.

Or use VS Code with the Live Server extension.



## Classroom use

Suggested prompts:

1. Move the microphone until the sound is loud. What is Δd/λ?
2. Move the microphone until the sound is quiet. What is Δd/λ?
3. Increase the speaker spacing. What happens to the interference pattern?
4. Increase the wavelength. What happens to the spacing between loud and quiet regions?
