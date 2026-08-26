# Changelog

All notable changes to the American Cloud TypeScript SDK are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
See [`VERSIONING.md`](./VERSIONING.md) for how SDK versions relate to the API version.

## [Unreleased]

## [1.4.0] - 2026-08-25

### Added

- WordPress: preview the cost of a plan change before you commit to it.
  `POST /wordpress/change-package/cost-estimate` returns the prorated charge for
  the rest of the current billing period, the difference in monthly rate, any
  account discount, and the period the charge covers. It changes nothing and
  charges nothing.
- WordPress: instance responses now carry `status` (`provisioning`, `active`,
  `failed` or `deleting`) and `failureReason`. Creating a site returns as soon
  as the request is accepted, with the new instance's `id` and `status` on the
  response — poll the instance until it reports `active`.
- Error responses carry an optional `code`, a machine-readable reason for the
  failure. Match on it rather than on `message`, which can be reworded at any
  time. It is present where one status code has more than one cause — for
  example a `409` that means `provisioning_in_progress` against one that means
  `deletion_in_progress`.
- WordPress: every operation on an existing instance now documents `409`. The
  `code` says which case it is: `provisioning_in_progress` while the site is
  still being set up, so retry once it is ready, or `deletion_in_progress`
  while the site is being removed.
- Databases: every backup operation now documents `409`. A backup needs the
  infrastructure cluster to be running, so the `code` is `infra_not_ready`
  while that cluster starts — retry once it is running — or `infra_deleting`
  while it is being removed. Destroying or retiring a backup repository that is
  still in use answers `409` with `backup_repo_in_use`.
- Isolated network responses carry `defaultEgressPolicy` (`allow` or `deny`):
  how outbound traffic is treated when the network has no egress rules. It is
  fixed when the network is created and cannot be changed afterwards.
- Egress rule responses carry `action` (`allow` or `deny`): whether the rule
  permits or blocks the traffic it matches. The rule's network decides this,
  not the rule itself.
- Deleting a virtual machine or a block storage volume answers `409` while the
  disk still has snapshots. The `code` is `volume_has_snapshots`, and the error
  body carries a `snapshots` array naming each one, so you can list what to
  remove without a second call. Delete the snapshots, then retry the delete.

### Changed

- Egress rule documentation no longer assumes that a rule permits traffic. A
  rule matches traffic, and the network's `defaultEgressPolicy` decides whether
  matching traffic is permitted or blocked. `sourceCidrList` selects which
  senders inside the network the rule matches; `destCidrList` selects where that
  traffic is headed.
- `networkAccess.allowOutbound` on VM creation now states both outcomes: `true`
  lets the new VM reach the internet, and `false` blocks all outbound traffic.
- The object storage cost estimate's `billing_note` now explains that nothing is
  charged up front and that usage appears on the monthly bill.
- `ChangePackageDto` is no longer re-exported from the `wordpress` namespace.
  Use `AmericancloudApi.ChangePackageDto`, which was already available and is
  unchanged; `AmericancloudApi.wordpress.ChangePackageDto` is gone. The type's
  shape is identical, and calls such as
  `client.wordpress.changePackageWordpress({ packageLabel })` are unaffected.
- `CreateVmDto.name` and the update-hostname request now state the naming rule
  and enforce it: 1 to 63 characters, starting with a letter, ending with a
  letter or a digit, and holding only letters, digits and hyphens. A name that
  breaks the rule is refused with `400` rather than failing later inside the
  platform.

### Fixed

- Error responses that carry a reason code now include `statusCode`, as the
  `ApiErrorDto` schema has always promised. Several of them built the body by
  hand and omitted it, which made the Python SDK raise a parsing error instead
  of a typed error, and left the field undefined in TypeScript and zero in Go.
  This affected the WordPress conflicts, the database backup conflicts, the
  suspended-account response, and the wallet and signup payment errors.
- `domain` on WordPress creation is a string. The schema described it as an
  object, so no SDK could send a custom domain.
- `VmResponseDto.subscriptionPeriod` is optional. It is absent for a few moments
  after a VM is created, while the billing term is still being recorded, and the
  schema previously said it was always present — so the Python SDK raised a
  parsing error for the whole listing whenever any VM was in that window. Poll
  until it appears. **This may need a change on your side**: in TypeScript the
  field is now `string | undefined`, and in Go it is a pointer. The create
  response, `CreateVmResponseDto`, still always carries it.

## [1.3.3] - 2026-07-27

### Added

- Port forwarding: optional `tierId` on rule creation — targets a specific VPC
  tier when the public IP is reserved in a VPC and the VM has interfaces in more
  than one tier. Otherwise the tier is inferred from the VM; ignored for IPs in
  an isolated network.

### Changed

- Deleting a VM now also deletes the network that was auto-created for it, once
  no other VMs remain on it, and releases that network's public IPs. A network
  you supply is never auto-deleted.

## [1.3.2] - 2026-06-17

### Added

- Database backup encryption: enable or disable encryption of a cluster's
  backups with a passphrase via `PATCH /databases/clusters/{id}/backups/config`
  (passphrase 12–256 printable-ASCII characters; AES-256-CFB). Backup
  configuration and backup-list responses now report encryption status
  (`enabled`, `algorithm`).

## [1.3.1] - 2026-06-05

### Added

- Typed `GatewayTimeoutError` (504): isolated-network and snapshot deletes now
  document their transient responses — `409` (the resource still has
  attachments releasing, e.g. a network's NICs or a snapshot's volume mid-
  modification) and `504` (deletion still in progress) — and both surface as
  typed errors. Both are retryable: retry the delete until it succeeds or the
  resource is gone (404).

## [1.3.0] - 2026-06-04

### Added

- VPC tier management: get, update (rename/description), restart, and delete a
  single network tier of a VPC (`/networks/vpc/{id}/tiers/{tierId}`). Tier
  objects — including the `tiers` array on a VPC detail — now carry `aclId`
  alongside `aclName`.
- Object storage unit create returns the created unit (`storageUnitId`,
  `createdAt`, `maxBuckets`) instead of a generic success acknowledgement; the
  returned `storageUnitId` is the identifier every other object-storage call
  takes.

### Changed

- **Breaking:** VM scale takes its parameters (`cpu`, `memoryMb`) in the JSON
  request body instead of query parameters — both integers ≥ 1, at least one
  required.
- **Breaking:** firewall, egress, and network ACL rule `startPort`/`endPort`
  are integers (1–65535) on create/update, matching the integer values
  already returned on read. They were previously strings.
- **Breaking:** object storage `maxBuckets` and `limitKb` are now a number or
  `null` (`null` means no limit); the previous `"unlimited"` string value is
  no longer returned.
- Isolated-network endpoints cover standalone networks only — VPC tiers are
  managed via the new tier endpoints and no longer appear in, or are
  addressable through, `/networks/isolated`. Isolated-network responses drop
  the tier-only `vpcId`/`vpcName`/`aclId`/`aclName` fields, and restart
  returns a plain success acknowledgement.
- VM `networkName`/`networkId`/`rootVolumeId` may be `null` while the VM is
  provisioning; `network` is optional on create (omit it to have an isolated
  network created automatically); the possible VM `status` values are now
  documented.
- Snapshot reads always include `type` (`DataDisk` or `RootDisk`).
- Isolated-network and VPC deletes wait for teardown completion and surface
  failures instead of reporting success on submission; the isolated-network
  delete response no longer carries an internal job identifier.

### Fixed

- Creating a snapshot of a volume that cannot be snapshotted returns a
  descriptive 400 instead of a 500; database backup operations on a deleted
  cluster return 404 instead of 500.

## [1.2.2] - 2026-06-02

### Added

- Initial public release of the American Cloud TypeScript SDK (`@americancloud/sdk`).
- Versioned in lockstep with the API platform: SDK `x.y.z` is generated from
  OpenAPI document `x.y.z`. Targets American Cloud API `v1`.
- Coverage for compute, block storage, snapshots, networking (VPC, isolated
  networks, ACLs, firewall, port-forwarding, load-balancer and egress rules),
  public IPs, DNS, managed databases, Kubernetes, object storage, and WordPress.

[Unreleased]: https://github.com/American-Cloud/americancloud-sdk-typescript/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.4.0
[1.3.3]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.3
[1.3.2]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.2
[1.3.1]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.1
[1.3.0]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.3.0
[1.2.2]: https://github.com/American-Cloud/americancloud-sdk-typescript/releases/tag/v1.2.2
