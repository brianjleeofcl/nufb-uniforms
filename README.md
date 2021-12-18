# [NUFB Uniform Tracker](https://nufbuniforms.com)

## Purpose

Compiled data for uniforms worn by Northwestern Wildcats Football

For more information, [see the about page](https://gist.github.com/brianjleeofcl/f26bfd0f02a97b061fec9588d7289eb0#file-about-md)

## Milestones
### V1 - Minimum viability
- Data model: uniform info, game result, major stats
- Data injestion: imports google sheet data on initialization, processes ESPN API data and keeps csv copy to import into SQL
- New Data: endpoints for new uniform data and game data updates
- API: JSON query response implemented in golang
- UI/UX:
    - Game timeline: full timeline of games since 2012, summary data and countdown for next available kickoff, infinite scrolling
    - Game details: full score, stats, tweets embedded
    - Uniform list: displays combination, game count & win ratio; sortable
    - Uniform detail: breakdown of different uniform configuration within color combination, list of games corresponding in grid layout
    - Timeline chart:

### Road map
##### User features:
- Data model: almanac, external links
- Advanced querying and filtering
- Advanced stats toolset
##### House cleaning:
- SSR metadata for link propagation in social networks & SEO
- Mobile experience clean up

## Development Documentation

#### Docker
For configuration purposes, this project uses multiple env files; these files are not committed in this repository and therefore need to be recreated locally with appropriate information.

#### Dev environment
Requires Go(v1.17.2) and Node 16(LTS)

#### Server configuration in development
This application needs two servers: api server and a static file server. There are different options for proxying: server in `/api` includes code that serve files from a local directory and `package.json` in `/frontend` is configured to proxy localhost ports to React's built-in development server; both cases assume a singular server handling proxying which is also possible to implement using different server platforms or load balancing proxies.
