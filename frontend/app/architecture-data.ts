import publicProjectAnalyses from "./public-project-analyses.json";

export type CodeSource = {
  project: string;
  path: string;
  startLine: number;
  endLine: number;
  sha256: string;
  capturedAt: string;
};

export type CodeExamplePart = {
  file: string;
  description: string;
  code: string;
  source?: CodeSource;
};

export type Rating = {
  name: string;
  scores: [number, number, number];
  reason: string;
  explanation: string;
  priority?: "Sehr hoch" | "Hoch" | "Mittel" | "Niedrig";
  priorityReason?: string;
  occurrence?: "Sehr hoch" | "Hoch" | "Mittel" | "Niedrig";
  currentExample?: string;
  currentParts?: CodeExamplePart[];
  recommendedParts?: CodeExamplePart[];
  currentSource?: CodeSource;
  currentEvidence?: "implementation" | "replacement-context";
  recommendedExample?: string;
  currentDescription?: string;
  recommendedDescription?: string;
};

export type Topic = {
  id: string;
  label: string;
  subtitle: string;
  rows: Rating[];
};

export type FrameworkArea = {
  id: string;
  label: string;
  subtitle: string;
  topics: Topic[];
};

export type ProjectAnalysis = {
  id: string;
  label: string;
  kind: "global" | "project";
  description: string;
  frameworks: FrameworkArea[];
};

const currentExamples: Record<string, string> = {
  "JPA-Entities & Hibernate":
    "@Entity\nclass ContentEntity {\n    @Id Long id;\n    @ManyToOne UserEntity author;\n    @OneToMany List<CommentEntity> comments;\n}",
  "Repository pro Entity":
    "interface ContentRepository extends JpaRepository<ContentEntity, Long> {}\n\n@Service\nclass ContentService {\n    List<ContentEntity> list() {\n        return contentRepository.findAll();\n    }\n}",
  "Request- & Response-Typen":
    "class ProfileResponseDto {\n    Long id;\n    String username;\n}\n\nclass ProfileMapper {\n    ProfileResponseDto toDto(User user) { ... }\n}",
  "Separate Mapper-Klassen":
    "@Component\nclass ProfileMapper {\n    ProfileDto toDto(UserEntity user) {\n        return new ProfileDto(user.getId(), user.getName());\n    }\n}",
  "Service-Schicht":
    "@Service\nclass ProfileService {\n    ProfileDto page(String username) {\n        return mapper.toDto(repository.findByUsername(username));\n    }\n}",
  "Interface für jeden Service":
    "interface ProfileService {}\n\n@Service\nclass ProfileServiceImpl implements ProfileService {\n    ...\n}",
  "BaseController / BaseService":
    "abstract class BaseController {\n    protected Long currentUserId() { ... }\n}\n\nclass ProfileController extends BaseController {}",
  "Technische Paketstruktur":
    "controllers/ProfileController.java\nservices/ProfileService.java\nrepositories/ProfileRepository.java\ndto/ProfileResponse.java",
  "REST-Controller":
    "@GetMapping(\"/{id}\")\nProfileDto get(@PathVariable long id) {\n    return service.get(id);\n}",
  "Dependency Injection":
    "@Autowired ProfileRepository repository;\n@Autowired ProfileMapper mapper;",
  "JDBC & parameterisiertes SQL":
    "List<Content> items = contentRepository.findVisibleByUser(username);\nreturn mapper.toCards(items);",
  Transaktionen:
    "void follow(long viewer, long target) {\n    repository.addFollow(viewer, target);\n    repository.incrementFollowerCount(target);\n}",
  "Flyway & Schema-Constraints":
    "class Content {\n    @NotNull String status;\n}\n\n// Datenbank akzeptiert trotzdem beliebige Alt- oder Fremddaten.",
  Authentifizierung:
    "String user = request.getHeader(\"X-User\");\nif (user == null) throw new UnauthorizedException();",
  "Autorisierung & Rollen":
    "@PreAuthorize(\"hasRole('USER')\")\nContentDto getPrivateContent(long id) { ... }",
  "Sessions & CSRF":
    "fetch('/api/follow', {\n    method: 'POST',\n    body: JSON.stringify(payload)\n});",
  Validierung:
    "void update(ProfileRequest request) {\n    profile.bio = request.bio();\n}",
  "Eigene Business-AOP":
    "@AuditedAction(\"FOLLOW\")\nvoid follow(long targetId) {\n    interactions.follow(targetId);\n}",
  "Logs, Metriken & Actuator":
    "log.info(\"request user={} token={} payload={}\", user, token, body);",
  Integrationstests:
    "@Test\nvoid serviceCallsRepository() {\n    verify(repository).findByUsername(\"alex\");\n}",
  "Mock-lastige Schichtentests":
    "when(repository.findById(1L)).thenReturn(entity);\nassertThat(service.get(1L).name()).isEqualTo(\"Alex\");",
  WebFlux:
    "Mono<ProfileDto> page(String username) {\n    return Mono.fromCallable(() -> jdbc.queryForObject(sql, mapper));\n}",
  "Statische Typisierung":
    "Map<String, Object> profile = api.profile();\nString name = (String) profile.get(\"display_name\");",
  Records:
    "class ContentCard {\n    private final long id;\n    private final String title;\n    // constructor, getters, equals, hashCode\n}",
  Enums:
    "if (\"published\".equals(content.status())) {\n    show(content);\n}",
  Klassen:
    "class ProfileUtils {\n    static ProfileDto build(...) { ... }\n    static boolean canView(...) { ... }\n}",
  Interfaces:
    "interface ProfileReader {\n    ProfileDto read(String username);\n}\n\nclass JdbcProfileReader implements ProfileReader {}",
  Vererbung:
    "class BaseService {\n    protected JdbcTemplate jdbc;\n    protected Long currentUser() { ... }\n}\n\nclass ProfileService extends BaseService {}",
  Komposition:
    "class ProfileService {\n    private final JdbcTemplate jdbc;\n    private final ObjectStorage storage;\n}",
  "Unveränderliche Daten":
    "profile.setDisplayName(request.displayName());\nprofile.setBio(request.bio());",
  "Globaler veränderlicher Zustand":
    "class CurrentUser {\n    static Long id;\n}\n\nCurrentUser.id = requestUser;",
  Generics:
    "Object load(String type, long id) {\n    return registry.get(type).find(id);\n}",
  var: "var result = client.fetch();\nvar value = result.getPayload().get(0);",
  Optional:
    "void update(Optional<String> name, Optional<String> bio) {\n    ...\n}",
  Exceptions:
    "class ProfileNotFoundException extends RuntimeException {}\nclass ProfileDeletedException extends ProfileNotFoundException {}",
  "try-with-resources":
    "InputStream input = storage.read(key);\nbyte[] bytes = input.readAllBytes();\ninput.close();",
  Streams:
    "return contents.stream()\n    .peek(content -> audit(content))\n    .filter(this::visible)\n    .map(this::toDto)\n    .toList();",
  Schleifen:
    "contents.stream()\n    .takeWhile(content -> !content.stop())\n    .forEach(this::process);",
  "Virtual Threads":
    "Executors.newFixedThreadPool(200).submit(() -> jdbc.query(sql, mapper));",
  "parallelStream()":
    "orders.parallelStream()\n    .map(order -> paymentClient.charge(order))\n    .toList();",
  "Eigene Reflection":
    "Object value = entity.getClass()\n    .getDeclaredField(fieldName)\n    .get(entity);",
  "Vertical Slices":
    "controller -> service -> repository -> mapper -> dto\n// Für einen kleinen Ablauf müssen alle Schichten geöffnet werden.",
  "Starre Schichtenarchitektur":
    "Controller -> Service -> Manager -> Repository -> Mapper\n// Auch einfache Lesezugriffe nehmen denselben Weg.",
  Objektorientierung:
    "class User {\n    List<Post> posts;\n    List<User> followers;\n    void publish(Post post) { ... }\n}",
  "Prozedurale Abläufe":
    "repository.load();\nmapper.map();\nvalidator.validate();\nnotifier.notify();",
  "Reine Funktionen":
    "PriceCalculator.total(cart, user, clock, databaseConnection);",
  "Domain-driven Design":
    "aggregate.apply(command);\nrepository.save(aggregate);\neventBus.publish(aggregate.events());",
  CQRS: "class UserEntity {\n    // wird für Detailseite, Listenansicht und Schreibmodell gleichzeitig verwendet\n}",
  "Event Sourcing":
    "events.append(new NameChanged(userId, name));\nprojection.rebuildAllUsers();",
  DRY: "abstract class AbstractCrudService<T> {\n    T create(T input) { ... }\n    T update(T input) { ... }\n}",
  "Single Responsibility":
    "class ProfileService {\n    Profile load();\n    Stats count();\n    Email renderNewsletter();\n}",
  Strategy:
    "interface ProfileVisibilityStrategy {}\nclass PublicVisibility implements ProfileVisibilityStrategy {}\nclass PrivateVisibility implements ProfileVisibilityStrategy {}",
  "Jeden Schritt auslagern":
    "ProfileDto page(String username) {\n    var user = loadUser(username);\n    var stats = loadStats(user);\n    return buildResponse(user, stats);\n}",
  "God Classes":
    "class UserService {\n    login(); profile(); uploadAvatar(); follow(); invoice(); moderate();\n}",
  "Lokales SQL-Mapping":
    "class ProfileRowMapper implements RowMapper<ProfileResponse> {\n    public ProfileResponse mapRow(ResultSet rs, int rowNum) {\n        return new ProfileResponse(...);\n    }\n}",
  "Kurze Filter & Transformationen":
    "var visible = new ArrayList<Content>();\nfor (var content : contents) {\n    if (content.isPublic()) visible.add(content);\n}",
  "Große Business-Lambdas":
    "transactionTemplate.execute(status -> {\n    validate(input);\n    writeSeveralTables(input);\n    sendMessages(input);\n    return result;\n});",
  "Verschachtelte Lambdas":
    "client.load(user, u -> cache.get(u.id(), cached ->\n    repository.save(cached, saved -> notify(saved))));",
  "Gespeicherte Callbacks":
    "callbacks.add(event -> service.handle(event, requestScopedUser));",
  "Explizite lokale Captures":
    "Predicate<Content> owned = content ->\n    content.ownerId() == currentUser.id();",
  "Server Components":
    "export default function Page() {\n  return <ClientPage />;\n}",
  "Client Components":
    "\"use client\";\nexport default function App() {\n  useEffect(() => fetch('/api/profile'), []);\n}",
  "Route Handler als BFF":
    "export async function POST() {\n  // duplicate follow rules here\n}",
  "Server Actions":
    "<form action={followUser}>...</form>",
  "Rewrites zum Backend":
    "const api = 'http://localhost:8085/api/profiles/alex/page';",
  "Frontend-eigene Domänenlogik":
    "if (profile.visibility === 'PRIVATE') hideContent();",
};

const recommendedExamples: Record<string, string> = {
  "JPA-Entities & Hibernate":
    "record ContentCard(long id, String title, String visibility) {}\n\nreturn jdbc.query(sql, cardMapper, viewerId, cursor);",
  "Repository pro Entity":
    "@Service\nclass ProfileService {\n    ProfilePage page(String username, Long viewer) {\n        return jdbc.query(sql, mapper, username, viewer);\n    }\n}",
  "Request- & Response-Typen":
    "record ProfileResponse(long id, String username) {}",
  "Separate Mapper-Klassen":
    "return jdbc.query(sql, (rs, n) ->\n    new ProfileResponse(rs.getLong(\"id\"), rs.getString(\"username\")),\n    username);",
  "Service-Schicht":
    "@Transactional(readOnly = true)\nProfilePage page(String username, Long viewer) {\n    var profile = profile(username, viewer);\n    return new ProfilePage(profile, stats(profile), contents(profile));\n}",
  "Interface für jeden Service":
    "@Service\nclass ProfileService {\n    ProfileService(JdbcTemplate jdbc, UserInteractionService interactions) { ... }\n}",
  "BaseController / BaseService":
    "class ProfileController {\n    ProfileController(ProfileService profiles, AuthSessions sessions) { ... }\n}",
  "Technische Paketstruktur":
    "features/users/profile/ProfileController.java\nfeatures/users/profile/ProfileService.java\nfeatures/users/profile/ProfileSql.sql",
  "REST-Controller":
    "@GetMapping(\"/{username}/page\")\nProfilePageResponse page(@PathVariable String username) {\n    return profiles.page(username, sessions.currentUserId());\n}",
  "Dependency Injection":
    "class ProfileService {\n    ProfileService(JdbcTemplate jdbc, UserInteractionService interactions) { ... }\n}",
  "JDBC & parameterisiertes SQL":
    "return jdbc.query(sql, (rs, rowNum) ->\n    new ContentCard(\n        rs.getLong(\"id\"),\n        rs.getString(\"title\")\n    ), viewerId, cursor);",
  Transaktionen:
    "@Transactional\nvoid follow(long viewer, long target) {\n    interactions.add(viewer, target, FOLLOW);\n}",
  "Flyway & Schema-Constraints":
    "CREATE TABLE contents (\n    status varchar(20) CHECK (status IN ('DRAFT','PUBLISHED')),\n    CHECK (status <> 'PUBLISHED' OR published_at IS NOT NULL)\n);",
  Authentifizierung:
    "Long viewer = sessions.requireUserId();\nprofiles.follow(username, viewer, true);",
  "Autorisierung & Rollen":
    "WHERE c.visibility = 'PUBLIC'\n   OR c.author_id = ?\n   OR EXISTS (SELECT 1 FROM grants g WHERE g.content_id = c.id AND g.user_id = ?)",
  "Sessions & CSRF":
    "const csrf = await fetch('/api/demo/csrf').then(r => r.json());\nawait fetch('/api/follow', { method: 'POST', headers: { [csrf.headerName]: csrf.token } });",
  Validierung:
    "record FollowRequest(@NotNull Boolean following) {}\n\nvoid follow(@Valid @RequestBody FollowRequest body) { ... }",
  "Eigene Business-AOP":
    "interactions.add(viewer, target, FOLLOW);\naudit.record(viewer, \"FOLLOW\", target);",
  "Logs, Metriken & Actuator":
    "log.info(\"profile_page_loaded username={} viewerPresent={}\", username, viewer != null);\nregistry.counter(\"profile.page\").increment();",
  Integrationstests:
    "mvc.perform(get(\"/api/profiles/alex/page\"))\n    .andExpect(status().isOk())\n    .andExpect(jsonPath(\"$.contents.items.length()\").value(12));",
  "Mock-lastige Schichtentests":
    "@SpringBootTest\n@AutoConfigureMockMvc\nclass ProfileApiTests {\n    // HTTP, Security, SQL und JSON gemeinsam prüfen\n}",
  WebFlux:
    "@RestController\nclass ProfileController {\n    ResponseEntity<ProfilePage> page(...) { return ok(service.page(...)); }\n}",
  "Statische Typisierung":
    "record Profile(long id, String username, String displayName) {}\nProfile profile = client.profile();",
  Records:
    "record ContentCard(long id, String title, String categoryKey) {}",
  Enums:
    "enum Status { DRAFT, PUBLISHED, DELETED }\nif (content.status() == Status.PUBLISHED) show(content);",
  Klassen:
    "class ProfileService {\n    ProfilePage page(String username, Long viewer) { ... }\n}",
  Interfaces:
    "interface ObjectStorage {\n    StoredObject read(String key) throws IOException;\n}\n\nclass LocalObjectStorage implements ObjectStorage {}",
  Vererbung:
    "class ProfileService {\n    private final AuthSessions sessions;\n    private final JdbcTemplate jdbc;\n}",
  Komposition:
    "class UserAvatarService {\n    UserAvatarService(JdbcTemplate jdbc, ObjectStorage storage) { ... }\n}",
  "Unveränderliche Daten":
    "record ProfileUpdate(String displayName, String bio) {}\nvar next = new ProfileUpdate(name, bio);",
  "Globaler veränderlicher Zustand":
    "Long viewer = sessions.currentUserId();\nprofiles.page(username, viewer);",
  Generics:
    "record CursorResponse<T>(List<T> items, Long nextCursor, boolean hasMore) {}",
  var: "ProfilePageResponse response = profiles.page(username, viewer);\nvar stats = response.stats();",
  Optional:
    "Optional<Profile> findProfile(String username) { ... }\nvoid update(String name, String bio) { ... }",
  Exceptions:
    "throw new ResponseStatusException(HttpStatus.NOT_FOUND);\n// Fachliche Fehler dort übersetzen, wo HTTP relevant ist.",
  "try-with-resources":
    "try (var input = storage.open(key)) {\n    return input.readAllBytes();\n}",
  Streams:
    "var cards = contents.stream()\n    .filter(Content::visible)\n    .map(ContentCard::from)\n    .toList();",
  Schleifen:
    "for (var content : contents) {\n    if (content.stop()) break;\n    process(content);\n}",
  "Virtual Threads":
    "Executors.newVirtualThreadPerTaskExecutor()\n    .submit(() -> jdbc.query(sql, mapper));\n// Danach Poolgrößen und DB-Verbindungen trotzdem messen.",
  "parallelStream()":
    "for (var order : orders) {\n    paymentClient.charge(order);\n}\n// Parallelisierung explizit planen und begrenzen.",
  "Eigene Reflection":
    "record ProfilePatch(String displayName, String bio) {}\napplyPatch(profile, patch);",
  "Vertical Slices":
    "features/users/profile/ProfileController.java\nfeatures/users/profile/ProfileService.java\n// Einstieg, Query und Antwort liegen nahe beieinander.",
  "Starre Schichtenarchitektur":
    "ProfileController -> ProfileService\n// Weitere Grenze nur ergänzen, wenn sie Verantwortung trägt.",
  Objektorientierung:
    "record Profile(long id, String username) {}\nclass UserInteractionService { void addFollow(...) { ... } }",
  "Prozedurale Abläufe":
    "var profile = loadProfile(username);\nvar stats = loadStats(profile.id());\nreturn new ProfilePage(profile, stats);",
  "Reine Funktionen":
    "Stats calculateStats(List<Content> contents, List<Interaction> interactions) {\n    return new Stats(posts, followers, following);\n}",
  "Domain-driven Design":
    "class UserInteractionService {\n    void add(long source, long target, InteractionType type) { ... }\n}",
  CQRS: "record ProfilePage(Profile profile, Stats stats, List<ContentCard> contents) {}\nrecord FollowCommand(long viewer, long target) {}",
  "Event Sourcing":
    "jdbc.update(\"INSERT INTO user_interactions(...) VALUES (...) ON CONFLICT DO NOTHING\", ...);\n// Events erst einführen, wenn Historie Kernanforderung ist.",
  DRY: "void assertCanView(long viewer, long author) { ... }\n// Gemeinsame fachliche Regel bündeln, ähnliche DTOs lokal lassen.",
  "Single Responsibility":
    "class ProfileService { ProfilePage page(...) { ... } }\nclass UserInteractionService { void add(...) { ... } }",
  Strategy:
    "Visibility visibility = Visibility.fromRequest(request);\nif (visibility == PRIVATE && !ownProfile) throw forbidden();",
  "Jeden Schritt auslagern":
    "ProfilePageResponse page(String username, Long viewer) {\n    var p = profile(username, viewer);\n    return new ProfilePageResponse(p, stats(p), contents(username, viewer));\n}",
  "God Classes":
    "features/users/profile/ProfileService.java\nfeatures/users/UserAvatarService.java\nfeatures/content/ContentMediaService.java",
  "Lokales SQL-Mapping":
    "return jdbc.query(sql, (rs, rowNum) ->\n    new ProfileResponse(\n        rs.getLong(\"id\"),\n        rs.getString(\"username\")\n    )\n);",
  "Kurze Filter & Transformationen":
    "var visible = contents.stream()\n    .filter(content -> content.isPublic())\n    .toList();",
  "Große Business-Lambdas":
    "@Transactional\nvoid publish(PublishRequest input) {\n    validate(input);\n    writeContent(input);\n    enqueuePreviewJob(input);\n}",
  "Verschachtelte Lambdas":
    "var cached = cache.get(userId);\nvar profile = cached.orElseGet(() -> repository.load(userId));\nnotify(profile);",
  "Gespeicherte Callbacks":
    "record ProfileEvent(long userId, String type) {}\neventQueue.add(new ProfileEvent(userId, \"FOLLOW\"));",
  "Explizite lokale Captures":
    "long viewerId = currentUser.id();\nPredicate<Content> ownedByViewer =\n    content -> content.ownerId() == viewerId;",
  "Server Components":
    "export default async function Page() {\n  const data = await getPresentationData();\n  return <ArchitectureExplorer initialData={data} />;\n}",
  "Client Components":
    "\"use client\";\nexport function ArchitectureExplorer({ initialData }) {\n  const [filter, setFilter] = useState('all');\n}",
  "Route Handler als BFF":
    "export async function GET() {\n  return fetch(`${backend}/api/profiles/alex/page`, {\n    headers: forwardedHeaders(),\n  });\n}",
  "Server Actions":
    "await fetch('/api/profiles/jordan/follow', {\n  method: 'POST',\n  headers: { 'X-CSRF-TOKEN': token },\n  body: JSON.stringify({ following: true }),\n});",
  "Rewrites zum Backend":
    "async rewrites() {\n  return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];\n}",
  "Frontend-eigene Domänenlogik":
    "const canExpand = row.currentExample || row.recommendedExample;\nreturn <ExpandableRow disabled={!canExpand} />;",
};

const explanations: Record<string, string> = {
  "JPA-Entities & Hibernate":
    "JPA und Hibernate bilden Datenbanktabellen als Java-Objekte ab. Das ist hilfreich, wenn ein fachliches Objektmodell im Mittelpunkt steht, kann bei leselastigen API-Antworten aber zusätzliche Navigations- und Mapping-Schichten erzeugen.",
  "Repository pro Entity":
    "Ein Repository kapselt Datenzugriff für eine Entity. Problematisch wird es, wenn jedes Repository nur Standardmethoden weiterreicht und der eigentliche Anwendungsfall über mehrere Klassen verteilt wird.",
  "Request- & Response-Typen":
    "Request- und Response-Typen beschreiben, welche Daten eine API annimmt und zurückgibt. Sie sind der Vertrag zwischen Frontend, Backend, Tests und Dokumentation.",
  "Separate Mapper-Klassen":
    "Mapper wandeln Daten von einer Form in eine andere, etwa Entity zu DTO. Sie lohnen sich bei komplexer oder wiederverwendeter Abbildung; bei kleinen lokalen Antworten können sie den Lesepfad verlängern.",
  "Service-Schicht":
    "Ein Service bündelt fachliche Abläufe, Transaktionen und Regeln. Er sollte Verantwortung tragen, nicht nur Controller-Aufrufe an Repositories weiterreichen.",
  "Interface für jeden Service":
    "Ein Interface beschreibt einen Vertrag zwischen Implementierung und Nutzer. Es ist wertvoll bei echten Austauschgrenzen, aber künstlich, wenn es immer genau eine interne Implementierung gibt.",
  "BaseController / BaseService":
    "Basisklassen teilen Verhalten über Vererbung. Dadurch kann wichtiges Verhalten unsichtbar in Elternklassen verschwinden, was Review und KI-Kontext erschwert.",
  "Technische Paketstruktur":
    "Eine technische Paketstruktur sortiert nach Controller, Service, Repository und DTO. Eine featureorientierte Struktur sortiert nach fachlichem Ablauf und hält zusammengehörige Dateien näher beieinander.",
  "REST-Controller":
    "Ein REST-Controller ist der HTTP-Einstieg einer API. Er übersetzt Pfade, Parameter und Request-Bodies in fachliche Aufrufe und gibt HTTP-Antworten zurück.",
  "Dependency Injection":
    "Dependency Injection bedeutet, dass Abhängigkeiten von außen bereitgestellt werden. Dadurch sieht man im Konstruktor, welche Fähigkeiten eine Klasse wirklich braucht.",
  "JDBC & parameterisiertes SQL":
    "JDBC führt SQL direkt aus. Parameterisiertes SQL trennt Eingaben von SQL-Code und schützt vor Injection, während die Query nahe am Anwendungsfall sichtbar bleibt.",
  Transaktionen:
    "Eine Transaktion fasst zusammengehörige Datenbankänderungen atomar zusammen. Entweder wird alles gespeichert oder nichts, damit keine halbfertigen Zustände entstehen.",
  "Flyway & Schema-Constraints":
    "Flyway versioniert Datenbankänderungen. Schema-Constraints erzwingen Regeln direkt in der Datenbank, unabhängig davon, welcher Code gerade schreibt.",
  Authentifizierung:
    "Authentifizierung klärt, wer der aktuelle Nutzer ist. Ohne verlässliche Identität können Berechtigungen und Audit-Informationen nicht sauber funktionieren.",
  "Autorisierung & Rollen":
    "Autorisierung entscheidet, was ein authentifizierter Nutzer tun oder sehen darf. Rollen sind nur ein Teil davon; oft braucht es zusätzlich objektbezogene Regeln.",
  "Sessions & CSRF":
    "Sessions halten eine Browser-Anmeldung über mehrere Requests. CSRF-Schutz verhindert, dass fremde Seiten im Namen des eingeloggten Nutzers ungewollt Schreibzugriffe auslösen.",
  Validierung:
    "Validierung prüft Eingaben am Rand des Systems. Sie ersetzt keine fachlichen Regeln oder Datenbank-Constraints, verhindert aber frühe, unnötige Fehlerpfade.",
  "Eigene Business-AOP":
    "AOP hängt Verhalten automatisch an Methoden, etwa über Annotationen. Für technische Querschnittsthemen ist das nützlich, bei fachlicher Logik kann es Abläufe verstecken.",
  "Logs, Metriken & Actuator":
    "Logs, Metriken und Actuator machen Laufzeitverhalten beobachtbar. Sie helfen beim Betrieb, dürfen aber keine sensiblen Daten preisgeben.",
  Integrationstests:
    "Integrationstests prüfen mehrere echte Grenzen zusammen, etwa HTTP, Security, SQL und JSON. Sie sind besonders wertvoll, wenn Architektur bewusst Schichten reduziert.",
  "Mock-lastige Schichtentests":
    "Mock-lastige Tests prüfen häufig interne Aufrufketten. Das kann fragile Tests erzeugen, die wenig über das echte Verhalten der Anwendung aussagen.",
  WebFlux:
    "WebFlux ist Springs reaktiver Web-Stack. Er passt zu durchgehend nicht-blockierendem I/O, ist aber kein automatischer Vorteil für klassische JDBC-Abläufe.",
  "Statische Typisierung":
    "Statische Typisierung lässt den Compiler viele Fehler vor dem Start finden. Für KI-generierten Code sind sichtbare Verträge besonders hilfreich.",
  Records:
    "Java Records sind kompakte, unveränderliche Datenträger für Werte und Antworten. Sie reduzieren Boilerplate und machen Datenformen sehr klar.",
  Enums:
    "Enums beschreiben eine geschlossene Menge erlaubter Werte. Dadurch werden Zustände wie PUBLISHED oder DRAFT expliziter als frei verteilte Strings.",
  Klassen:
    "Klassen bündeln Zustand und Verhalten. Sie sollten nach Verantwortung geschnitten werden, nicht als reine Zwischenstation ohne eigenen Nutzen.",
  Interfaces:
    "Interfaces beschreiben, was eine Abhängigkeit kann. Sie eignen sich für Provider, externe Systeme oder stabile Grenzen, nicht als Pflichtübung für jede Klasse.",
  Vererbung:
    "Vererbung teilt Verhalten über Eltern- und Kindklassen. Sie ist passend bei echten Subtyp-Beziehungen, verteilt Logik aber schnell über mehrere Ebenen.",
  Komposition:
    "Komposition setzt Fähigkeiten aus konkreten Abhängigkeiten zusammen. Eine Klasse bekommt genau das, was sie braucht, statt Verhalten aus einer Basisklasse zu erben.",
  "Unveränderliche Daten":
    "Unveränderliche Daten ändern sich nach dem Erzeugen nicht mehr. Das macht Nebenläufigkeit, Review und lokale Analyse einfacher.",
  "Globaler veränderlicher Zustand":
    "Globaler veränderlicher Zustand kann überall gelesen und geändert werden. Dadurch wird schwer nachvollziehbar, warum ein Ablauf ein bestimmtes Ergebnis liefert.",
  Generics:
    "Generics ermöglichen typsichere Wiederverwendung, etwa Listen oder Cursor-Antworten mit verschiedenen Inhaltstypen.",
  var: "var lässt Java den lokalen Variablentyp ableiten. Das ist angenehm, wenn der Typ offensichtlich ist, kann aber Orientierung kosten, wenn der Rückgabewert unklar ist.",
  Optional:
    "Optional macht eine möglicherweise fehlende Rückgabe sichtbar. Als Parameter oder Feld wird es oft sperrig und kann den eigentlichen Vertrag verschleiern.",
  Exceptions:
    "Exceptions beschreiben Fehlerpfade. Sie sollten Grenzen klar machen, aber nicht für jeden kleinen fachlichen Fall eine tiefe Hierarchie erzeugen.",
  "try-with-resources":
    "try-with-resources schließt Dateien, Streams und andere Ressourcen automatisch. Das verhindert Leaks auch dann, wenn innerhalb des Blocks Fehler passieren.",
  Streams:
    "Streams beschreiben Transformationen über Collections. Sie sind gut für kurze Pipelines, werden aber unübersichtlich, wenn Seiteneffekte und lange Ketten dazukommen.",
  Schleifen:
    "Schleifen sind direkter Kontrollfluss. Bei Abbruchbedingungen, Seiteneffekten oder schrittweiser Verarbeitung sind sie oft leichter zu lesen als verschachtelte Streams.",
  "Virtual Threads":
    "Virtual Threads sind leichte Java-Threads für viele blockierende Aufgaben. Sie ersetzen keine Datenbank-Poolplanung und machen CPU-Arbeit nicht schneller.",
  "parallelStream()":
    "parallelStream verteilt Stream-Arbeit auf mehrere Threads. Ohne Kontrolle über Ressourcen, Reihenfolge und Kosten kann das langsamer oder riskanter werden.",
  "Eigene Reflection":
    "Reflection greift zur Laufzeit auf Klassen, Methoden oder Felder zu. Das kann Frameworks ermöglichen, nimmt aber dem Compiler Sichtbarkeit.",
  "Vertical Slices":
    "Vertical Slices schneiden Software nach Anwendungsfällen statt nach technischen Schichten. Ziel ist, den Weg von Anfrage zu Regel zu Datenzugriff kompakt zu halten.",
  "Starre Schichtenarchitektur":
    "Eine starre Schichtenarchitektur zwingt jeden Ablauf durch dieselbe Layer-Reihenfolge. Das schafft Ordnung, kann aber unnötige Sprünge erzeugen.",
  Objektorientierung:
    "Objektorientierung modelliert Fachlichkeit über Objekte mit Zustand und Verhalten. Sie ist nützlich, wenn das Modell wirklich trägt, aber nicht jeder API-Ablauf braucht einen großen Objektgraphen.",
  "Prozedurale Abläufe":
    "Prozedurale Abläufe beschreiben eine klare Schrittfolge. Das kann sehr gut lesbar sein, solange Grenzen und Invarianten bewusst bleiben.",
  "Reine Funktionen":
    "Reine Funktionen liefern bei gleicher Eingabe immer gleiche Ausgabe und haben keine Seiteneffekte. Dadurch sind sie leicht zu testen und zu prüfen.",
  "Domain-driven Design":
    "Domain-driven Design richtet Code an fachlichen Begriffen und Grenzen aus. Der taktische Mustersatz sollte nur so groß sein wie das Problem.",
  CQRS:
    "CQRS trennt Lese- und Schreibmodelle. Das kann komplexe Abfragen vereinfachen, muss aber nicht gleich getrennte Systeme bedeuten.",
  "Event Sourcing":
    "Event Sourcing speichert Ereignisse statt nur aktuellen Zustand. Es ist stark bei Historie und Audit, bringt aber Projektionen und Migrationsaufwand mit.",
  DRY: "DRY bedeutet, Wissen nicht widersprüchlich zu duplizieren. Ähnlicher Code allein reicht aber nicht immer für eine gemeinsame Abstraktion.",
  "Single Responsibility":
    "Single Responsibility heißt, nach Änderungsgründen zu schneiden. Es bedeutet nicht, jede Mini-Operation in eine eigene Klasse zu verschieben.",
  Strategy:
    "Strategy kapselt austauschbare Varianten hinter einem gemeinsamen Vertrag. Es lohnt sich, wenn Varianten real existieren und nicht nur hypothetisch denkbar sind.",
  "Jeden Schritt auslagern":
    "Auslagerung kann Methoden lesbarer machen. Wird jeder kleine Schritt ausgelagert, muss man aber mehr springen, ohne mehr Verständnis zu gewinnen.",
  "God Classes":
    "God Classes sammeln zu viele unabhängige Verantwortungen. Lokaler Kontext ist gut, aber nicht auf Kosten klarer Feature-Grenzen.",
  "Lokales SQL-Mapping":
    "Lokales SQL-Mapping hält Query und Antwortform direkt zusammen. Das hilft beim Review, weil sichtbar ist, welche Spalten in welchen Vertrag fließen.",
  "Kurze Filter & Transformationen":
    "Kurze Filter und Transformationen sind kleine lokale Datenumformungen. Sie sind ideal, wenn Eingabe, Bedingung und Ergebnis direkt sichtbar bleiben.",
  "Große Business-Lambdas":
    "Große Business-Lambdas verstecken fachliche Schritte in anonymen Funktionen. Benannte Methoden machen Verantwortung und Fehlerpfade besser greifbar.",
  "Verschachtelte Lambdas":
    "Verschachtelte Lambdas erzeugen Callback-Tiefen. Dadurch wird die Reihenfolge von Ausführung, Fehlern und Seiteneffekten schwerer lesbar.",
  "Gespeicherte Callbacks":
    "Gespeicherte Callbacks werden später ausgeführt. Deshalb muss klar sein, welche Objekte sie festhalten und wann sie laufen.",
  "Explizite lokale Captures":
    "Ein Capture ist eine Variable, die eine Lambda-Funktion aus ihrer Umgebung verwendet. Explizite lokale Captures machen sichtbar, welche Daten in die Funktion eingehen.",
  "Server Components":
    "Server Components rendern React-Komponenten auf dem Server und schicken weniger JavaScript an den Browser. Sie eignen sich für Datenladen und statische Darstellung.",
  "Client Components":
    "Client Components laufen im Browser. Sie sind nötig für Interaktion wie Suche, Filter, Sortierung, lokale Bewertung und aufgeklappte Details.",
  "Route Handler als BFF":
    "Route Handler sind Next.js-Endpunkte. Als Backend-for-Frontend können sie aggregieren oder weiterleiten, sollten aber keine zweite Fachlogik-Wahrheit erzeugen.",
  "Server Actions":
    "Server Actions erlauben serverseitige Aktionen direkt aus React-Formularen. Bei bestehendem Spring-Backend muss man genau prüfen, ob sie Zuständigkeiten duplizieren.",
  "Rewrites zum Backend":
    "Rewrites leiten Browserpfade intern an ein Backend weiter. So bleibt die Oberfläche auf derselben Origin, während das Backend API und Security hält.",
  "Frontend-eigene Domänenlogik":
    "Frontend-Domänenlogik sind fachliche Entscheidungen im Browser. Anzeigezustände gehören dort hin; Berechtigungen und Datenintegrität sollten serverseitig bleiben.",
};

const codeDescription = (
  name: string,
  kind: "current" | "recommended",
  dominantChoice: number,
) => {
  if (kind === "recommended" && dominantChoice === 2) {
    return "Dieses Beispiel zeigt die Variante, die wir in diesem Kontext beibehalten oder als Zielbild verwenden würden. Wichtig ist nicht nur die Syntax, sondern dass Verantwortung, Datenfluss und Sicherheitsgrenze sichtbar bleiben.";
  }
  if (kind === "current") {
    return `Dieses Beispiel zeigt ein typisches Muster, wie ${name} in vielen Projekten heute umgesetzt wird. Es ist nicht automatisch falsch, zeigt aber die Stelle, an der Review, KI-Kontext oder Änderungswege unübersichtlich werden können.`;
  }
  return `Dieses Beispiel zeigt die empfohlene Anpassung für ${name}. Die Variante soll den betroffenen Ablauf klarer machen und die fachliche oder technische Grenze dort halten, wo sie wirklich gebraucht wird.`;
};

const row = (
  name: string,
  scores: Rating["scores"],
  reason: string,
  currentExample?: string,
  recommendedExample?: string,
): Rating => ({
  name,
  scores,
  reason,
  explanation:
    explanations[name] ??
    `${name} ist ein Architekturbaustein, dessen Nutzen stark vom konkreten Projekt abhängt. Entscheidend ist, ob dadurch Verantwortung, Datenfluss und Review klarer werden.`,
  currentExample: currentExample ?? currentExamples[name],
  recommendedExample: recommendedExample ?? recommendedExamples[name],
  currentDescription: codeDescription(name, "current", dominant(scores)),
  recommendedDescription: codeDescription(name, "recommended", dominant(scores)),
});

const springTopics: Topic[] = [
  {
    id: "spring",
    label: "Spring Boot",
    subtitle: "Weniger Schichten. Dieselben Garantien.",
    rows: [
      row(
        "JPA-Entities & Hibernate",
        [75, 15, 10],
        "Für diese SQL-orientierte Demo verzichtbar. Bei komplexen Objektgraphen kann ORM weiterhin eine gute Wahl sein.",
      ),
      row(
        "Repository pro Entity",
        [65, 25, 10],
        "Ein Wrapper ohne eigene Verantwortung verlängert den Weg zur Query. Wiederverwendbare fachliche Abfragen können eine eigene Grenze rechtfertigen.",
      ),
      row(
        "Request- & Response-Typen",
        [0, 80, 20],
        "Verträge bleiben explizit und typisiert; kleine Records stehen direkt am Anwendungsfall.",
        "class ProfileResponseDto {\n    Long id;\n    String username;\n}\n\nclass ProfileMapper {\n    ProfileResponseDto toDto(User user) { ... }\n}",
        "record ProfileResponse(long id, String username) {}",
      ),
      row(
        "Separate Mapper-Klassen",
        [70, 20, 10],
        "Kleine Abbildungen lokal halten. Aufwendige oder mehrfach benötigte Transformationen gezielt auslagern.",
      ),
      row(
        "Service-Schicht",
        [10, 65, 25],
        "Nach fachlichen Abläufen schneiden. Transaktionsgrenzen und gemeinsame Regeln begründen einen Service.",
      ),
      row(
        "Interface für jeden Service",
        [90, 5, 5],
        "Ein Interface lohnt sich an austauschbaren Grenzen wie ObjectStorage; nicht automatisch für jede Klasse.",
      ),
      row(
        "BaseController / BaseService",
        [90, 10, 0],
        "Generische Basisklassen verstecken Verhalten. Konkrete Abläufe und Komposition erleichtern das Nachverfolgen.",
      ),
      row(
        "Technische Paketstruktur",
        [10, 85, 5],
        "Dateien nach Feature bündeln, statt Controller, Services und Modelle über globale Ordner zu verteilen.",
      ),
      row(
        "REST-Controller",
        [0, 15, 85],
        "HTTP-Vertrag und Einstiegspunkt bleiben klar erkennbar. Keine Datenbankabstraktion nur für die Form.",
      ),
      row(
        "Dependency Injection",
        [0, 10, 90],
        "Abhängigkeiten per Konstruktor sichtbar machen. Lebenszyklen und Konfiguration übernimmt Spring.",
      ),
      row(
        "JDBC & parameterisiertes SQL",
        [0, 15, 85],
        "Queries nahe am Anwendungsfall. Query-Pläne, Indizes und Datenmengen entscheiden über Performance, nicht die Anzahl der Codezeilen.",
        "List<Content> items = contentRepository.findVisibleByUser(username);\nreturn mapper.toCards(items);",
        "return jdbc.query(sql, (rs, rowNum) ->\n    new ContentCard(\n        rs.getLong(\"id\"),\n        rs.getString(\"title\")\n    ), viewerId, cursor);",
      ),
      row(
        "Transaktionen",
        [0, 10, 90],
        "Zusammengehörige Änderungen brauchen atomare Grenzen und einen bewussten Umgang mit Nebenläufigkeit.",
      ),
      row(
        "Flyway & Schema-Constraints",
        [0, 5, 95],
        "Versionierte Migrationen und Datenbankregeln sichern die Integrität unabhängig vom aufrufenden Code.",
      ),
      row(
        "Authentifizierung",
        [0, 5, 95],
        "Identität und Session-Verarbeitung bleiben Aufgabe bewährter Sicherheitsmechanismen.",
      ),
      row(
        "Autorisierung & Rollen",
        [0, 60, 40],
        "Zugriffsregeln fachlich verständlich am Use Case ausdrücken. Objektbezogene Rechte nicht durch Rollen allein ersetzen.",
      ),
      row(
        "Sessions & CSRF",
        [0, 10, 90],
        "Browserbasierte Sessions brauchen passende Schutzmechanismen. Ein neues Frontend hebt diese Anforderungen nicht auf.",
      ),
      row(
        "Validierung",
        [0, 15, 85],
        "Eingaben am Rand prüfen; fachliche und Datenbank-Invarianten zusätzlich an ihren jeweiligen Grenzen absichern.",
      ),
      row(
        "Eigene Business-AOP",
        [65, 30, 5],
        "Versteckte fachliche Ausführung erschwert das Review. Explizite Aufrufe bevorzugen.",
      ),
      row(
        "Logs, Metriken & Actuator",
        [0, 10, 90],
        "Laufzeitverhalten muss beobachtbar bleiben. Sensible Daten gehören nicht in Logs.",
      ),
      row(
        "Integrationstests",
        [0, 15, 85],
        "Echte HTTP-, SQL- und Sicherheitsgrenzen prüfen. KI-generierter Code braucht überprüfbare Erwartungen.",
      ),
      row(
        "Mock-lastige Schichtentests",
        [35, 55, 10],
        "Verhalten statt interner Aufrufketten prüfen; Mocks gezielt an externen Grenzen einsetzen.",
      ),
      row(
        "WebFlux",
        [80, 10, 10],
        "Für diese blockierende JDBC-Demo kein Default. Ein vollständig reaktiver Ablauf kann andere Anforderungen erfüllen.",
      ),
    ],
  },
  {
    id: "java",
    label: "Java",
    subtitle: "Explizite Verträge. Lokale Komplexität.",
    rows: [
      row(
        "Statische Typisierung",
        [0, 0, 100],
        "Compilerfeedback begrenzt Fehler und macht Verträge für Mensch und KI überprüfbar.",
      ),
      row(
        "Records",
        [0, 5, 95],
        "Kompakte Datenträger für Antworten und Werte. Referenzierte veränderliche Objekte werden dadurch nicht automatisch unveränderlich.",
        "record ContentCard(long id, String title) {}",
      ),
      row(
        "Enums",
        [0, 10, 90],
        "Geschlossene Wertemengen explizit ausdrücken, statt frei verteilte Strings zu vergleichen.",
      ),
      row(
        "Klassen",
        [0, 30, 70],
        "Nach zusammengehöriger Verantwortung schneiden. Keine Klasse nur als Zwischenstation erzeugen.",
      ),
      row(
        "Interfaces",
        [15, 65, 20],
        "An stabilen Austauschgrenzen einsetzen. Eine zweite Implementierung ist ein Hinweis, aber nicht die einzige Begründung.",
      ),
      row(
        "Vererbung",
        [65, 25, 10],
        "Tiefe Hierarchien verteilen Verhalten. Echte Subtyp-Beziehungen sind weiterhin ein legitimer Einsatz.",
      ),
      row(
        "Komposition",
        [0, 10, 90],
        "Benötigte Fähigkeiten als sichtbare Abhängigkeiten zusammenstellen.",
      ),
      row(
        "Unveränderliche Daten",
        [0, 15, 85],
        "Weniger versteckte Zustandswechsel vereinfachen Nebenläufigkeit und lokale Analyse.",
      ),
      row(
        "Globaler veränderlicher Zustand",
        [90, 10, 0],
        "Weitreichende Seiteneffekte verhindern, dass man einen Ablauf lokal verstehen kann.",
      ),
      row(
        "Generics",
        [5, 35, 60],
        "Typisierte Wiederverwendung beibehalten; komplizierte Typsystem-Konstruktionen brauchen einen konkreten Nutzen.",
      ),
      row(
        "var",
        [5, 30, 65],
        "Bei offensichtlichem Typ hilfreich. Bei unklaren Rückgaben kann der ausgeschriebene Typ mehr Orientierung bieten.",
      ),
      row(
        "Optional",
        [10, 50, 40],
        "Optionalität in Rückgaben sichtbar machen; nicht wahllos in Felder und Parameter tragen.",
      ),
      row(
        "Exceptions",
        [0, 30, 70],
        "Fehlergrenzen explizit behandeln. Nicht für jeden fachlichen Fall eine eigene Exception-Hierarchie.",
      ),
      row(
        "try-with-resources",
        [0, 0, 100],
        "Ressourcen zuverlässig schließen. Framework-verwaltete Ressourcen nicht zusätzlich manuell besitzen.",
      ),
      row(
        "Streams",
        [10, 50, 40],
        "Gut für lokale Transformationen. Lange Ketten mit Seiteneffekten erschweren die Kontrolle.",
      ),
      row(
        "Schleifen",
        [0, 5, 95],
        "Direkte Kontrollflüsse sind bei Abbruchbedingungen und zustandsbehafteten Abläufen oft klarer.",
      ),
      row(
        "Virtual Threads",
        [20, 30, 50],
        "Für viele blockierende I/O-Aufgaben prüfen. Sie beschleunigen keine CPU-Arbeit und vergrößern keinen Connection-Pool.",
      ),
      row(
        "parallelStream()",
        [80, 15, 5],
        "Kein pauschaler Performance-Schalter. Ausführung, Datenmenge und gemeinsame Ressourcen müssen dazu passen.",
      ),
      row(
        "Eigene Reflection",
        [80, 15, 5],
        "Laufzeitmagie reduziert die Hilfe des Compilers und versteckt Verbindungen.",
      ),
    ],
  },
  {
    id: "patterns",
    label: "Programmiermuster",
    subtitle: "Die Grenze ist der Anwendungsfall.",
    rows: [
      row(
        "Vertical Slices",
        [0, 15, 85],
        "HTTP-Einstieg, SQL und Antwort eines Features liegen nahe beieinander. Gemeinsame Invarianten bleiben gemeinsam.",
      ),
      row(
        "Starre Schichtenarchitektur",
        [70, 25, 5],
        "Nicht jeder Ablauf muss dieselbe Zahl von Schichten durchlaufen. Jede Grenze sollte eine Verantwortung tragen.",
      ),
      row(
        "Objektorientierung",
        [5, 65, 30],
        "Zustand und Verhalten gezielt modellieren. Nicht jedes Problem verlangt einen umfangreichen Objektgraphen.",
      ),
      row(
        "Prozedurale Abläufe",
        [5, 15, 80],
        "Ein geradliniger Ablauf lässt sich gut verfolgen, solange fachliche Grenzen und Zuständigkeiten erhalten bleiben.",
      ),
      row(
        "Reine Funktionen",
        [0, 15, 85],
        "Berechnungen ohne Seiteneffekte sind leicht isoliert zu prüfen.",
      ),
      row(
        "Domain-driven Design",
        [10, 60, 30],
        "Gemeinsame Sprache und fachliche Grenzen nutzen. Den Umfang des taktischen Mustersatzes am Problem ausrichten.",
      ),
      row(
        "CQRS",
        [25, 50, 25],
        "Lesen und Schreiben können unterschiedliche Modelle brauchen. Separate Systeme sind dafür nicht zwingend nötig.",
      ),
      row(
        "Event Sourcing",
        [80, 10, 10],
        "Historisierung als Kernanforderung kann es rechtfertigen; Projektionen, Migrationen und Betrieb bringen Zusatzaufwand.",
      ),
      row(
        "DRY",
        [5, 80, 15],
        "Gemeinsame fachliche Regeln bündeln. Ähnlicher Code allein beweist noch keine gemeinsame Abstraktion.",
      ),
      row(
        "Single Responsibility",
        [0, 65, 35],
        "Nach Änderungsgründen schneiden, nicht automatisch nach jedem einzelnen Arbeitsschritt.",
      ),
      row(
        "Strategy",
        [25, 45, 30],
        "Sinnvoll für tatsächliche Varianten. Keine hypothetischen Erweiterungspunkte auf Vorrat.",
      ),
      row(
        "Jeden Schritt auslagern",
        [80, 15, 5],
        "Methoden sollten beim Verstehen helfen. Triviale Weiterleitungen erhöhen nur die Zahl der Sprünge.",
      ),
      row(
        "God Classes",
        [80, 20, 0],
        "Lokaler Kontext ist kein Grund, unabhängige Features in einer riesigen Klasse zu vermischen.",
      ),
    ],
  },
  {
    id: "closures",
    label: "Closures",
    subtitle: "Nah am Einsatz. Klar im Datenfluss.",
    rows: [
      row(
        "Lokales SQL-Mapping",
        [0, 5, 95],
        "Ein kurzes Lambda hält Query und Ergebnisform zusammen.",
        "class ProfileRowMapper implements RowMapper<ProfileResponse> {\n    public ProfileResponse mapRow(ResultSet rs, int rowNum) {\n        return new ProfileResponse(...);\n    }\n}",
        'return jdbc.query(sql, (rs, rowNum) ->\n    new ProfileResponse(\n        rs.getLong("id"),\n        rs.getString("username")\n    )\n);',
      ),
      row(
        "Kurze Filter & Transformationen",
        [5, 15, 80],
        "Ein lokaler Ausdruck ist gut nachvollziehbar, wenn Eingabe und Ergebnis klar sind.",
        "var visible = new ArrayList<Content>();\nfor (var content : contents) {\n    if (content.isPublic()) visible.add(content);\n}",
        "var visible = contents.stream()\n    .filter(content -> content.isPublic())\n    .toList();",
      ),
      row(
        "Große Business-Lambdas",
        [25, 65, 10],
        "Bei mehreren Verantwortungen oder Fehlerpfaden besser eine benannte Methode im selben Feature verwenden.",
      ),
      row(
        "Verschachtelte Lambdas",
        [65, 30, 5],
        "Viele Callback-Ebenen verstecken die Reihenfolge und den Fehlerfluss. Kontrollfluss möglichst direkt ausdrücken.",
      ),
      row(
        "Gespeicherte Callbacks",
        [45, 45, 10],
        "Lebensdauer und Ausführungszeitpunkt müssen erkennbar bleiben; eingefangene Objekte können unerwartet lange leben.",
      ),
      row(
        "Explizite lokale Captures",
        [5, 20, 75],
        "Java erlaubt finale oder effektiv finale lokale Variablen. Das eingefangene Objekt selbst kann trotzdem veränderlich sein.",
        "Predicate<Content> owned = content ->\n    content.ownerId() == currentUser.id();",
        "long viewerId = currentUser.id();\nPredicate<Content> ownedByViewer =\n    content -> content.ownerId() == viewerId;",
      ),
    ],
  },
];

const nextTopics: Topic[] = [
  {
    id: "next-runtime",
    label: "Next.js",
    subtitle: "Rendering, Routing und Backend-Grenze bewusst schneiden.",
    rows: [
      row(
        "Server Components",
        [5, 25, 70],
        "Gut für serverseitiges Rendering ohne Client-Bundle. Fachlogik, Autorisierung und Transaktionen bleiben in dieser Architektur im Spring-Backend.",
        "export default function Page() {\n  return <ClientPage />;\n}",
        "export default async function Page() {\n  const data = await getPresentationData();\n  return <ArchitectureExplorer initialData={data} />;\n}",
      ),
      row(
        "Client Components",
        [0, 40, 60],
        "Interaktive Tabellen, Filter und aufgeklappte Details gehören in den Client. Datenzugriff und Regeln sollten dadurch nicht unsichtbar werden.",
        "\"use client\";\nexport default function App() {\n  useEffect(() => fetch('/api/profile'), []);\n}",
        "\"use client\";\nexport function ArchitectureExplorer({ initialData }) {\n  const [filter, setFilter] = useState('all');\n}",
      ),
      row(
        "Route Handler als BFF",
        [20, 55, 25],
        "Kann für Aggregation oder Formatwechsel helfen. In diesem Setup sollte er keine zweite fachliche Backend-Schicht neben Spring werden.",
        "export async function POST() {\n  // duplicate follow rules here\n}",
        "export async function GET() {\n  return fetch(`${backend}/api/profiles/alex/page`, {\n    headers: forwardedHeaders(),\n  });\n}",
      ),
      row(
        "Server Actions",
        [45, 40, 15],
        "Für einfache Next-only Formulare spannend. Bei Spring-Security, CSRF und API-Verträgen muss der Nutzen gegen zusätzliche Zuständigkeiten abgewogen werden.",
        "<form action={followUser}>...</form>",
        "await fetch('/api/profiles/jordan/follow', {\n  method: 'POST',\n  headers: { 'X-CSRF-TOKEN': token },\n  body: JSON.stringify({ following: true }),\n});",
      ),
      row(
        "Rewrites zum Backend",
        [0, 20, 80],
        "Der Browser bleibt auf einer Origin, während Spring die API schützt. Das passt gut zur lokalen Demo und hält Auth/CSRF zentral.",
        "const api = 'http://localhost:8085/api/profiles/alex/page';",
        "async rewrites() {\n  return [{ source: '/api/:path*', destination: `${backend}/api/:path*` }];\n}",
      ),
      row(
        "Frontend-eigene Domänenlogik",
        [70, 25, 5],
        "Anzeigeentscheidungen ja, fachliche Sichtbarkeit und Berechtigungen nein. Sonst entstehen zwei Wahrheiten.",
        "if (profile.visibility === 'PRIVATE') hideContent();",
        "const canExpand = row.currentExample || row.recommendedExample;\nreturn <ExpandableRow disabled={!canExpand} />;",
      ),
    ],
  },
];

export const analyses: ProjectAnalysis[] = [
{
    id: "global",
    label: "Global / Allgemein",
    kind: "global",
    description: "Allgemeine Architektur-Hypothesen für AI-gestützte Entwicklung.",
    frameworks: [
      {
        id: "spring-java",
        label: "Backend: Spring Boot & Java",
        subtitle: "Featureorientierte Services, SQL, Typen und Schutzmechanismen.",
        topics: springTopics,
      },
      {
        id: "next",
        label: "Frontend: Next.js",
        subtitle: "App Router, Client-Interaktion und Grenze zum Backend.",
        topics: nextTopics,
      },
    ],
  },
...publicProjectAnalyses as ProjectAnalysis[]
];

export const choices = ["Weglassen", "Neu definieren", "Nutzen"] as const;

export function dominant(scores: Rating["scores"]): number {
  const max = Math.max(...scores);
  return scores.filter((score) => score === max).length > 1
    ? -1
    : scores.indexOf(max);
}
