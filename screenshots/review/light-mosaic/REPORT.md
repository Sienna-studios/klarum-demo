# Review light-mosaic

## light: /v2

- Off-token values: 18 distinct (186 uses). Top: border-colour rgb(227, 230, 232) x61; spacing 20px x22; spacing 19.5px x18
- Overlay vs Brief: build 1440x6006, target 1440x5461; pixel mismatch 51.5% first screen, 24.7% full page
- Stress: native-320 o0/c2/v0, native-390 o0/c2/v0, native-zoom200 o0/c1/v0, native-reduced-motion o0/c2/v3, os-light-320 o0/c2/v0, os-light-390 o0/c2/v0, os-light-zoom200 o0/c1/v0, os-light-reduced-motion o0/c2/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 5.06:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 97, LCP 2408 ms, TBT 79 ms, CLS 0; budget pass
- Before load (mobile, cold): 311.4 KB, 12 requests; HAR + budget tests pass
