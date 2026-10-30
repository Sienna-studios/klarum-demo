# Review step3-after

## dark: /

- Off-token values: 0 distinct (0 uses). Top: 
- Overlay vs Brief: build 1440x6723, target 1440x5461; pixel mismatch 19.7% first screen, 30.2% full page
- Stress: dark-320 o0/c0/v0, dark-390 o0/c0/v0, dark-zoom200 o0/c0/v0, dark-reduced-motion o0/c0/v0, light-320 o0/c0/v0, light-390 o0/c0/v0, light-zoom200 o0/c0/v0, light-reduced-motion o0/c0/v0 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 5.06:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 97, LCP 1809 ms, TBT 132 ms, CLS 0; budget pass
- Census (dark): red 47 (fit 36, revision 4, citation 4, primary action 3, other 0); decorative 5
- Before load (mobile, cold): 227.1 KB, 10 requests; HAR + budget tests pass

## light: /v2

- Off-token values: 0 distinct (0 uses). Top: 
- Overlay vs Brief: build 1440x5879, target 1440x5461; pixel mismatch 52.9% first screen, 23.7% full page
- Stress: native-320 o0/c0/v0, native-390 o0/c0/v0, native-zoom200 o0/c0/v0, native-reduced-motion o0/c0/v0, os-light-320 o0/c0/v0, os-light-390 o0/c0/v0, os-light-zoom200 o0/c0/v0, os-light-reduced-motion o0/c0/v0 (o overflow, c clip, v overlap)
- Axe (stress, serious+critical): 0 across 8 configs
- Contrast over photos: worst 5.06:1 (min 4.5); failing text boxes: 0
- Lighthouse mobile median of 3: perf 99, LCP 2116 ms, TBT 60 ms, CLS 0; budget pass
- Census (native): red 36 (fit 24, revision 4, citation 4, primary action 4, other 0); decorative 5
- Before load (mobile, cold): 277.6 KB, 12 requests; HAR + budget tests pass
