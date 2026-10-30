# Review light-mosaic

## dark: /

- Off-token values: 12 distinct (108 uses). Top: spacing 20px x26; spacing 10px x20; spacing 2px x18
- Overlay vs Brief: build 1440x6734, target 1440x5461; pixel mismatch 20.5% first screen, 30.7% full page
- Stress: dark-320 o0/c4/v0, dark-390 o0/c4/v0, dark-zoom200 o0/c4/v0, dark-reduced-motion o0/c4/v3, light-320 o0/c4/v0, light-390 o0/c4/v0, light-zoom200 o0/c4/v0, light-reduced-motion o0/c4/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 5.06:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 98, LCP 1725 ms, TBT 151 ms, CLS 0; budget pass
- Before load (mobile, cold): 226.5 KB, 10 requests; HAR + budget tests pass

## light: /v2

- Off-token values: 17 distinct (185 uses). Top: border-colour rgb(227, 230, 232) x61; spacing 20px x22; spacing 19.5px x18
- Overlay vs Brief: build 1440x6006, target 1440x5461; pixel mismatch 51.9% first screen, 24.8% full page
- Stress: native-320 o0/c2/v0, native-390 o0/c2/v0, native-zoom200 o0/c1/v0, native-reduced-motion o0/c2/v3, os-light-320 o0/c2/v0, os-light-390 o0/c2/v0, os-light-zoom200 o0/c1/v0, os-light-reduced-motion o0/c2/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 5.06:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 97, LCP 2408 ms, TBT 77 ms, CLS 0; budget pass
- Before load (mobile, cold): 311.1 KB, 12 requests; HAR + budget tests pass
