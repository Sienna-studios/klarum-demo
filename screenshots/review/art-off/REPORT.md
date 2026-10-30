# Review art-off

## dark: /?photos=0

- Off-token values: 12 distinct (106 uses). Top: spacing 20px x26; spacing 10px x20; spacing 2px x18
- Overlay vs Brief: build 1440x5923, target 1440x5461; pixel mismatch 20.5% first screen, 16.6% full page
- Stress: dark-320 o0/c4/v0, dark-390 o0/c4/v0, dark-zoom200 o0/c4/v0, dark-reduced-motion o0/c4/v3, light-320 o0/c4/v0, light-390 o0/c4/v0, light-zoom200 o0/c4/v0, light-reduced-motion o0/c4/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst Infinity:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 97, LCP 1730 ms, TBT 197 ms, CLS 0; budget pass
- Before load (mobile, cold): 226.1 KB, 10 requests; HAR + budget tests pass

## light: /v2/c?photos=0

- Off-token values: 20 distinct (206 uses). Top: border-colour rgb(227, 230, 232) x61; spacing 20px x22; spacing 10px x20
- Overlay vs Brief: build 1440x6022, target 1440x5461; pixel mismatch 20.7% first screen, 17.2% full page
- Stress: native-320 o0/c1/v10, native-390 o0/c1/v8, native-zoom200 o0/c1/v5, native-reduced-motion o0/c1/v3, os-light-320 o0/c1/v10, os-light-390 o0/c1/v8, os-light-zoom200 o0/c1/v5, os-light-reduced-motion o0/c1/v3 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst Infinity:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 98, LCP 1808 ms, TBT 145 ms, CLS 0; budget pass
- Before load (mobile, cold): 227.6 KB, 11 requests; HAR + budget tests pass
