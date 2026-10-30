# Review light-mosaic

## light: /v2

- Off-token values: 17 distinct (187 uses). Top: border-colour rgb(227, 230, 232) x61; spacing 20px x22; spacing 19.5px x20
- Overlay vs Brief: build 1440x6237, target 1440x5461; pixel mismatch 65.4% first screen, 26.6% full page
- Stress: native-320 o0/c1/v0, native-390 o0/c1/v0, native-zoom200 o0/c1/v0, native-reduced-motion o0/c1/v3, os-light-320 o0/c1/v0, os-light-390 o0/c1/v0, os-light-zoom200 o0/c1/v0, os-light-reduced-motion o0/c1/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 3.81:1 (min 4.5); failing text boxes: 2
- Lighthouse mobile median of 3: perf 97, LCP 2411 ms, TBT 78 ms, CLS 0; budget pass
- Before load (mobile, cold): 314.6 KB, 12 requests; HAR + budget tests pass
