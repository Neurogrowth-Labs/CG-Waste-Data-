# Demolition geointelligence integration

## Architecture and provenance

CG Waste Data is a Vite/React 19 application using React Leaflet for its existing Projects map and Supabase Auth, Postgres, RLS, and Realtime. This integration extends that exact Projects map with `DemolitionIntelligenceMap`; it does not embed another application or introduce a second map library.

An attempt to inspect and clone the requested `bilawalsidhu/gods-eye-view` repository was blocked by the execution environment's outbound GitHub proxy (`CONNECT tunnel failed, 403`). Its files, licence, dependencies, and provenance therefore could not be independently verified. **No code, assets, or dependencies from that repository have been copied or adapted.** This is an independent implementation that uses the existing Leaflet and Supabase dependencies, so no third-party attribution from that repository is asserted or required. Before any future source reuse, obtain and review its repository licence and preserve its required notices.

## Data flow

A gateway authenticates devices server-side and writes validated, deduplicated `device_telemetry` and `material_detections` records. Supabase Realtime delivers only changed table rows to subscribed authorized clients; the map reloads bounded per-project datasets rather than reinitializing the map. The computer-vision provider remains outside the browser and emits normalized detection events; the `material_taxonomy` table makes classifications configurable.

All geometries are WGS 84 (EPSG:4326). GeoJSON is retained for browser rendering and PostGIS `geography` fields supply indexed spatial queries. Telemetry/detection source event IDs enforce gateway idempotency. Device credentials, CV service tokens, and media credentials belong in the server-side gateway secret store and must never be supplied to Vite environment variables.

## Deployment

1. Apply `database-schema.sql` in a Supabase database with PostGIS enabled, preferably through a reviewed migration tool.
2. Configure the gateway with a server-only Supabase service role, device credentials, TLS, rate limits, schema validation, and retry/backoff. Do not expose that role to the web client.
3. Insert material taxonomy records for each organization and have the gateway create telemetry/detections through a privileged API that validates site/device membership.
4. Confirm Realtime publication is enabled for the four demolition tables, then deploy the Vite build.

The UI supports area creation/archival and registration of an adapter-backed device. A production `/devices/connect` service should authenticate the adapter, test telemetry/camera health, and update `field_devices.connection_status`; browser code intentionally never accepts device secrets.
