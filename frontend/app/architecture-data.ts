import { withProjectEvidence } from "./project-code-evidence";
import { globalFrontendTopics } from "./global-frontend-data";

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
  references?: { title: string; url: string }[];
  reviewedAt?: string;
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
const projectRow = (
  name: string,
  scores: Rating["scores"],
  explanation: string,
  reason: string,
  priority: Rating["priority"],
  priorityReason: string,
  occurrence: Rating["occurrence"],
  currentExample: string,
  recommendedExample: string,
  currentDescription: string,
  recommendedDescription: string,
): Rating => ({
  name,
  scores,
  explanation,
  reason,
  priority,
  priorityReason,
  occurrence,
  currentExample,
  recommendedExample,
  currentDescription,
  recommendedDescription,
});
const revidaconScores: Record<string, Rating["scores"]> = {
  "JPA-Entities & Hibernate": [65, 30, 5],
  "Repository pro Entity": [45, 45, 10],
  "Request- & Response-Typen": [0, 15, 85],
  "Separate Mapper-Klassen": [35, 50, 15],
  "Service-Schicht": [5, 55, 40],
  "Interface für jeden Service": [85, 10, 5],
  "BaseController / BaseService": [95, 5, 0],
  "Technische Paketstruktur": [75, 20, 5],
  "REST-Controller": [0, 10, 90],
  "Dependency Injection": [0, 5, 95],
  "JDBC & parameterisiertes SQL": [0, 35, 65],
  Transaktionen: [0, 20, 80],
  "Flyway & Schema-Constraints": [0, 20, 80],
  Authentifizierung: [0, 20, 80],
  "Autorisierung & Rollen": [0, 55, 45],
  "Sessions & CSRF": [0, 25, 75],
  Validierung: [0, 25, 75],
  "Eigene Business-AOP": [75, 20, 5],
  "Logs, Metriken & Actuator": [0, 20, 80],
  Integrationstests: [0, 15, 85],
  "Mock-lastige Schichtentests": [55, 35, 10],
  WebFlux: [95, 5, 0],
  "Statische Typisierung": [0, 5, 95],
  Records: [0, 10, 90],
  Enums: [0, 25, 75],
  Klassen: [0, 45, 55],
  Interfaces: [20, 65, 15],
  Vererbung: [90, 10, 0],
  Komposition: [0, 10, 90],
  "Unveränderliche Daten": [0, 20, 80],
  "Globaler veränderlicher Zustand": [90, 10, 0],
  Generics: [10, 45, 45],
  var: [20, 45, 35],
  Optional: [15, 60, 25],
  Exceptions: [5, 45, 50],
  "try-with-resources": [0, 5, 95],
  Streams: [15, 55, 30],
  Schleifen: [0, 10, 90],
  "Virtual Threads": [20, 55, 25],
  "parallelStream()": [90, 10, 0],
  "Eigene Reflection": [85, 15, 0],
  "Vertical Slices": [0, 10, 90],
  "Starre Schichtenarchitektur": [90, 10, 0],
  Objektorientierung: [10, 70, 20],
  "Prozedurale Abläufe": [5, 20, 75],
  "Reine Funktionen": [0, 20, 80],
  "Domain-driven Design": [5, 55, 40],
  CQRS: [5, 45, 50],
  "Event Sourcing": [85, 10, 5],
  DRY: [20, 70, 10],
  "Single Responsibility": [0, 55, 45],
  Strategy: [30, 50, 20],
  "Jeden Schritt auslagern": [80, 15, 5],
  "God Classes": [90, 10, 0],
  "Lokales SQL-Mapping": [0, 20, 80],
  "Kurze Filter & Transformationen": [5, 25, 70],
  "Große Business-Lambdas": [65, 30, 5],
  "Verschachtelte Lambdas": [80, 15, 5],
  "Gespeicherte Callbacks": [55, 40, 5],
  "Explizite lokale Captures": [5, 25, 70],
  "Server Components": [5, 35, 60],
  "Client Components": [0, 35, 65],
  "Route Handler als BFF": [10, 55, 35],
  "Server Actions": [70, 25, 5],
  "Rewrites zum Backend": [0, 25, 75],
  "Frontend-eigene Domänenlogik": [75, 20, 5],
};
const revidaconExamples: Record<
  string,
  Pick<Rating, "currentExample" | "recommendedExample">
> = {
  "JPA-Entities & Hibernate": {
    currentExample:
      "class ContractAccession {\n    static belongsTo = [contractUuid: ContractUuid]\n    static hasMany = [statusChanges: ContractAccessionStatusChange]\n\n    static mapping = { table \"contract_accession\" }\n    static constraints = { status nullable: false }\n}",
    recommendedExample:
      "record AccessionTableRow(long id, String ik, String contractName, String status) {}\n\nreturn jdbc.query(sql, rowMapper, filter.status(), user.accessiblePartners());",
  },
  "Request- & Response-Typen": {
    currentExample:
      "Map result = [success: true, actionTitle: actionTitle, data: marshallResult.data]\nrender result as JSON",
    recommendedExample:
      "record AccessionActionResponse(\n    boolean success,\n    String actionTitle,\n    List<AccessionActionRow> rows\n) {}",
  },
  "BaseController / BaseService": {
    currentExample:
      "class ContractAccessionController extends AbstractExtendedBaseDomainController<ContractAccession> {\n    def ajaxDTList() { ... }\n    def ajaxDoAction() { ... }\n}",
    recommendedExample:
      "class ContractAccessionController {\n    ContractAccessionController(AccessionPage page, AccessionActions actions) { ... }\n}",
  },
  "Technische Paketstruktur": {
    currentExample:
      "grails-app/controllers/de/cse/aoe/rv/contractAccession\n grails-app/services/de/cse/aoe/rv/contracts\n grails-app/domain/de/cse/aoe/rv/contractAccession",
    recommendedExample:
      "features/accessions/page\nfeatures/accessions/actions\nfeatures/contracts/imports\nfeatures/files/download",
  },
  "JDBC & parameterisiertes SQL": {
    currentExample:
      "ContractAccession.createCriteria().list(params) {\n    contractUuid { inList(\"status\", params.status) }\n}",
    recommendedExample:
      "SELECT ca.id, ca.ik, cu.status\nFROM contract_accession ca\nJOIN contract_uuid cu ON cu.id = ca.contract_uuid_id\nWHERE cu.status = ANY(:statuses)\n  AND ca.partner_id = ANY(:visiblePartnerIds)",
  },
  "Autorisierung & Rollen": {
    currentExample:
      "if (Authority.has(Authority.ROLE_ADMIN)) return true\nSet<Long> userIds = listAccessibleUserIdsForCurrentUser(params.permissionParams)",
    recommendedExample:
      "authorization.assertCanReadAccession(user, accessionId);\n\nWHERE ca.partner_id = ANY(:accessiblePartnerIds)",
  },
  Vererbung: {
    currentExample:
      "class ContractService extends AbstractExtendedBaseDomainService<Contract> {\n    protected void additionalFiltering(hcb, params) { ... }\n}",
    recommendedExample:
      "class ContractService {\n    ContractService(ContractQueries queries, ContractAuthorization authorization) { ... }\n}",
  },
  Records: {
    currentExample:
      "Map row = [id: accession.id, ik: accession.ik, status: accession.status?.name()]",
    recommendedExample:
      "record AccessionRow(long id, String ik, ContractStatus status, boolean editable) {}",
  },
  Enums: {
    currentExample:
      "if (params.status == \"PARTICIPATION\") {\n    // magic string from UI/select2\n}",
    recommendedExample:
      "enum ContractAccessionStatus { PARTICIPATION, CANCELED, OPTED_OUT }\n\nrecord AccessionFilter(Set<ContractAccessionStatus> statuses) {}",
  },
  "Globaler veränderlicher Zustand": {
    currentExample:
      "def ctx = Holders.grailsApplication.mainContext\nreturn ctx.getBean(ContractFileService)",
    recommendedExample:
      "class ContractFileUseCase {\n    ContractFileUseCase(ContractFileService files, CurrentUserProvider users) { ... }\n}",
  },
  "Vertical Slices": {
    currentExample:
      "Controller -> BaseController -> Service -> Domain -> Marshaller -> GSP/Backbone",
    recommendedExample:
      "features/accessions/action\n  AccessionActionController\n  AccessionActionService\n  AccessionActionRepository\n  AccessionActionResponse",
  },
  CQRS: {
    currentExample:
      "ContractAccession wird fuer Tabellen, Modals, Aktionen, Validierung und Statusberechnung genutzt.",
    recommendedExample:
      "record AccessionPageRow(...)\nrecord ChangeAccessionStatusCommand(...)\n\nclass AccessionQueries {}\nclass AccessionCommands {}",
  },
  "Frontend-eigene Domänenlogik": {
    currentExample:
      "if (model.get('canBeActivated')) {\n  view.showActionButton();\n}",
    recommendedExample:
      "type AccessionAction = { label: string; allowed: boolean; reason?: string };\n// Backend entscheidet allowed, Frontend rendert nur.",
  },
};
const revidaconPriority = (name: string): Rating["priority"] => {
  if (
    [
      "JPA-Entities & Hibernate",
      "BaseController / BaseService",
      "Technische Paketstruktur",
      "REST-Controller",
      "Autorisierung & Rollen",
      "Statische Typisierung",
      "Vererbung",
      "Vertical Slices",
      "Starre Schichtenarchitektur",
      "Frontend-eigene Domänenlogik",
    ].includes(name)
  ) {
    return "Sehr hoch";
  }
  if (["WebFlux", "parallelStream()", "Event Sourcing", "Server Actions"].includes(name)) {
    return "Mittel";
  }
  return "Hoch";
};
// Reviewed against application sources and build declarations. Missing technology
// alone is not an exclusion: useful rewrite proposals remain in the analysis.
const revidaconExcludedRows: Record<string, string> = {
  WebFlux: "Keine reaktiven HTTP-Pfade oder Reactor-Abhaengigkeiten nachgewiesen; kein konkreter Rewrite-Bedarf.",
  "parallelStream()": "Keine Aufrufe nachgewiesen; die vorhandenen Jobs brauchen explizite Job-Steuerung.",
  "Event Sourcing": "Keine Event-Store-/Replay-Architektur nachgewiesen; Statushistorien allein sind kein Event Sourcing.",
  "Server Actions": "Kein Next.js-Bestand; fuer das geplante separate REST-Backend kein konkreter Zusatznutzen begruendet.",
  "Interface für jeden Service": "Kein entsprechendes Service-Interface-Muster im Anwendungscode nachgewiesen.",
  "Repository pro Entity": "Keine entsprechenden Repository-Klassen nachgewiesen; GORM-Datenzugriff wird separat bewertet.",
  "Eigene Business-AOP": "Keine eigenen Business-Aspekte nachgewiesen; Framework-Transaktionen bleiben ein eigenes Thema.",
  "Jeden Schritt auslagern": "Keine konkrete Fundstelle fuer diese pauschale Stilkritik; belegte Basisklassen und Service-Locator werden separat bewertet.",
};

const relevantRevidaconTopics = (topics: Topic[]): Topic[] =>
  withProjectEvidence("revidacon", topics
    .map((topic) => ({
      ...topic,
      rows: topic.rows.filter((rating) => !Object.hasOwn(revidaconExcludedRows, rating.name)),
    }))
    .filter((topic) => topic.rows.length > 0));

const revidaconOccurrence = (name: string): Rating["occurrence"] => {
  if (name === "Eigene Reflection") return "Niedrig";
  if (
    [
      "JPA-Entities & Hibernate",
      "Service-Schicht",
      "BaseController / BaseService",
      "Technische Paketstruktur",
      "Dependency Injection",
      "Transaktionen",
      "Klassen",
      "Vererbung",
      "Starre Schichtenarchitektur",
      "DRY",
      "Client Components",
      "Frontend-eigene Domänenlogik",
    ].includes(name)
  ) {
    return "Sehr hoch";
  }
  if (["WebFlux", "Virtual Threads", "Server Actions", "Event Sourcing"].includes(name)) {
    return "Niedrig";
  }
  return "Hoch";
};
const revidaconReason = (base: Rating): string =>
  `RevidaCon-spezifisch neu bewertet: ${base.name} wird hier nicht abstrakt betrachtet, sondern als Entscheidung fuer den kompletten Rewrite des Grails/Groovy/Backbone-Monolithen. Die Prozentwerte spiegeln ein, ob das Muster im neuen Spring/Java-Zielsystem uebernommen, neu definiert oder bewusst verworfen werden sollte.`;
const revidaconExplanation = (base: Rating): string =>
  `${base.explanation} Im RevidaCon-Kontext ist wichtig, dass der alte Code nicht mechanisch migriert wird: viele heutige Stellen sind durch Grails-Konventionen, GORM-Domains, Basisklassen, dynamische Maps, Backbone/GSP und historisch gewachsene Services gepraegt.`;
const revidaconProjectRow = (base: Rating): Rating => {
  const scores = revidaconScores[base.name] ?? base.scores;
  const examples = revidaconExamples[base.name] ?? {};
  return {
    ...base,
    scores,
    reason: revidaconReason(base),
    explanation: revidaconExplanation(base),
    priority: revidaconPriority(base.name),
    priorityReason:
      "Prioritaet fuer den Rewrite: Diese Entscheidung beeinflusst, ob AI und Reviewer einen Use Case lokal verstehen, testen und sicher veraendern koennen.",
    occurrence: revidaconOccurrence(base.name),
    currentExample: examples.currentExample ?? base.currentExample,
    recommendedExample: examples.recommendedExample ?? base.recommendedExample,
    currentDescription:
      "IST in RevidaCon: Dieses Beispiel steht fuer ein Muster aus dem bestehenden Grails/Groovy/Backbone-System oder fuer dessen typische Auswirkung im Projekt.",
    recommendedDescription:
      "SOLL fuer RevidaCon: Dieses Beispiel zeigt, wie der Punkt im Neubau expliziter, testbarer und AI-freundlicher modelliert werden sollte.",
  };
};
const revidaconFromGlobalTopic = (
  topic: Topic,
  label = topic.label,
  subtitle = topic.subtitle,
): Topic => ({
  id: `revidacon-${topic.id}`,
  label,
  subtitle: `${subtitle} Projektbezogen fuer RevidaCon neu bewertet.`,
  rows: topic.rows.map(revidaconProjectRow),
});
const revidaconBackendTopics: Topic[] = [
  {
    id: "rewrite",
    label: "Rewrite-Strategie",
    subtitle: "Vom Grails-Monolithen zu klaren Rewrite-Slices.",
    rows: [
      projectRow(
        "Feature-Slices statt Grails-Schichten",
        [5, 80, 15],
        "RevidaCon ist aktuell stark nach Grails-Konventionen, Base-Controllern, Domain-Klassen und Backbone-Schichten organisiert. Für einen kompletten Neubau sollte die fachliche Funktion der primäre Schnitt sein.",
        "Nicht jede bestehende Controller/Service/Domain-Datei sollte 1:1 übersetzt werden. Die neue Architektur sollte pro Ablauf sichtbar machen: HTTP/API, Berechtigung, Validierung, Datenzugriff, Antwortvertrag und Nebenwirkungen.",
        "Sehr hoch",
        "Das ist die wichtigste Weiche für AI-Development. Wenn wir die alten Schichten nachbauen, übernehmen wir die heutigen Navigationsprobleme in neuer Syntax.",
        "Sehr hoch",
        "class ContractAccessionController extends AbstractExtendedBaseDomainController<ContractAccession> {\n    def ajaxDTList() { ... }\n    def ajaxDoAction() { ... }\n}",
        "@RestController\n@RequestMapping(\"/api/contracts/accessions\")\nclass ContractAccessionApi {\n    ContractAccessionPage page(Filter filter, CurrentUser user) {\n        return useCase.page(filter, user.id());\n    }\n}",
        "Aktuell hängt ein großer fachlicher Ablauf an generischen Grails-Basisklassen und vielen Ajax-Endpunkten. Für Reviewer und KI ist schwer sichtbar, welche Regeln zu welchem konkreten Use Case gehören.",
        "Im Rewrite sollte ein Use Case als zusammenhängender Slice modelliert werden. Nicht die alte Datei-Struktur ist die Vorlage, sondern der fachliche Ablauf.",
      ),
      projectRow(
        "Legacy-Code nicht mechanisch migrieren",
        [85, 10, 5],
        "Ein mechanischer Rewrite würde Grails/GORM/Backbone-Strukturen nur in ein neues Framework kopieren. Das würde die technische Schuld konservieren.",
        "Die Analyse soll entscheiden, welche Konzepte fachlich bleiben, nicht welche Klassen weiterleben. Besonders alte Controller-Aktionen, generische Table-Config-Pfade und Domain-Callbacks sollten kritisch geprüft werden.",
        "Sehr hoch",
        "Der Nutzer hat explizit einen vollständigen Neubau genannt. Damit ist die wichtigste Entscheidung: nicht portieren, sondern fachlich neu schneiden.",
        "Sehr hoch",
        "ContractAccession.beforeUpdate()\nContractService.additionalFiltering(...)\nContractAccessionController.ajaxSaveContractAccessionDataFromModal()",
        "record ContractAccessionDecision(...)\n\n@Transactional\nvoid changeStatus(ChangeAccessionStatus command) {\n    rules.assertAllowed(command);\n    accessions.changeStatus(command);\n}",
        "Aktuell liegen Lebenszykluslogik, Filterlogik und UI-Aktionen über verschiedene Legacy-Orte verteilt.",
        "Der neue Code sollte Kommandos, Regeln und persistente Änderungen explizit machen. Das hilft AI, gezielte Änderungen vorzunehmen.",
      ),
      projectRow(
        "Domänenmodule priorisieren",
        [0, 65, 35],
        "RevidaCon enthält viele Domänen: Verträge, Beitritte, Partner, Himi, VTV, PQ, Dateien, Nachrichten, Jobs, Importe und Nutzerrechte. Ein Big-Bang-Rewrite ohne Modulpriorisierung wäre riskant.",
        "Die neue Analyse sollte zuerst Kernmodule mit hohem fachlichem Risiko priorisieren: ContractUuid/ContractAccession, Produkt-/Preisimporte, Berechtigungen und File/Export.",
        "Sehr hoch",
        "Bei 274 Domain-Klassen und 567 Services ist eine Reihenfolge nötig. AI kann besser helfen, wenn ein Modul klare Grenzen und Akzeptanztests bekommt.",
        "Sehr hoch",
        "grails-app/domain/de/cse/aoe/rv/contractAccession\n grails-app/services/de/cse/aoe/rv/contracts\n grails-app/assets/javascripts/backbone/specialContractUuid",
        "modules/contracts\nmodules/accessions\nmodules/imports\nmodules/files\nmodules/identity\n\n// jeweils eigene API, Tests und Datenmigration",
        "Die aktuelle Struktur zeigt fachliche Bereiche, aber sie sind technisch und historisch verwoben.",
        "Für den Neubau sollten Module zuerst als Zielkarte definiert werden. Danach kann AI je Modul Slices implementieren.",
      ),
    ],
  },
  {
    id: "spring-target",
    label: "Spring Boot",
    subtitle: "Zielbackend für den RevidaCon-Neubau bewerten.",
    rows: [
      projectRow(
        "Spring Boot statt Grails als Zielplattform",
        [5, 20, 75],
        "RevidaCon läuft aktuell auf Grails 6. Grails bringt viel Konvention, dynamische Laufzeitmagie und GORM-Integration mit. Für einen vollständigen Neubau ist Spring Boot als expliziteres Backend-Fundament besser geeignet.",
        "Ich würde Spring Boot als Zielplattform nutzen, aber nicht als klassische Schichtenmaschine. Wichtig ist Spring Boot für HTTP, DI, Security, Transactions, Observability und Konfiguration; die fachlichen Module sollten projektbezogen geschnitten werden.",
        "Sehr hoch",
        "Diese Entscheidung setzt den Rahmen für fast alle weiteren Architekturentscheidungen. Sie beeinflusst AI-Kontext, Tests, Build, Deployment, API-Verträge und Datenzugriff.",
        "Sehr hoch",
        "plugins {\n    id \"org.grails.grails-web\" version \"6.2.3\"\n    id \"org.grails.grails-gsp\" version \"6.2.3\"\n}\n\nimplementation \"org.grails:grails-web-boot\"",
        "@SpringBootApplication\nclass RevidaConApplication {}\n\n@RestController\n@RequestMapping(\"/api/contracts\")\nclass ContractController {\n    private final ContractPageService pages;\n}",
        "Aktuell ist Grails die Plattform und bestimmt Controller, Views, GORM, Assets und Konventionen.",
        "Im Neubau sollte Spring Boot nur die technische Laufzeit liefern. Die Architektur entsteht aus fachlichen Modulen und expliziten Verträgen.",
      ),
      projectRow(
        "Spring MVC REST Controller",
        [0, 15, 85],
        "REST Controller sind im Zielsystem der klare Einstiegspunkt für Frontend und Integrationen. RevidaCon hat bereits einige REST-v2-Ansätze, aber der Hauptteil läuft noch über Grails-Controller, GSP und Ajax-Fragmente.",
        "Für den Rewrite sollten neue Funktionen primär über REST/OpenAPI laufen. Servergerenderte Fragmente und Backbone-Endpunkte sollten nicht fortgeführt werden.",
        "Sehr hoch",
        "Ein konsistenter API-Vertrag ist Voraussetzung für modernes Frontend, AI-generierte Clients, Tests und spätere Modultrennung.",
        "Hoch",
        "def ajaxListTableContent() {\n    render(template: \"/contractAccession/templates/listTableContent\", model: [...])\n}",
        "@GetMapping\nContractAccessionPage list(@Valid ContractAccessionFilter filter, CurrentUser user) {\n    return pageService.list(filter, user.id());\n}",
        "Der IST-Code liefert oft UI-Templates oder Backbone-spezifische JSON-Strukturen.",
        "Der SOLL-Code liefert fachliche Datenverträge. Rendering und Interaktion gehören ins neue Frontend.",
      ),
      projectRow(
        "Spring Security mit objektbezogenen Policies",
        [0, 45, 55],
        "RevidaCon hat komplexe Rechte über Rollen, Partner, Distributor, ConcernGroup, IKs und fachliche Zustände. Ein einfacher Rollencheck reicht nicht.",
        "Spring Security sollte für Authentifizierung und technische Security genutzt werden. Objektbezogene Rechte sollten als Policies/Query-Filter je Use Case sichtbar sein.",
        "Sehr hoch",
        "Berechtigungen sind in RevidaCon fachlich zentral. Fehler wären kritisch und schwer nachträglich zu korrigieren.",
        "Sehr hoch",
        "if( Authority.has(Authority.ROLE_ADMIN) ) return true\nSet<Long> userIds = listAccessibleUserIdsForCurrentUser(params.permissionParams)",
        "authorization.assertCanReadContract(user, contractId);\n\nWHERE contract.partner_id = ANY(:accessiblePartnerIds)",
        "Aktuell sind Berechtigungen über Authority, Services, Criteria und Basisklassen verteilt.",
        "Im Neubau sollte jede API explizit zeigen, welche fachliche Zugriffspolitik gilt.",
      ),
      projectRow(
        "Spring Transactions bewusst setzen",
        [0, 20, 80],
        "Im aktuellen Projekt tragen sehr viele Services `@Transactional`. Das ist grundsätzlich wichtig, aber oft großflächig und wenig aussagekräftig.",
        "Im Neubau sollten Transaktionen pro fachlichem Schreib-Use-Case gesetzt werden. Lese-Queries sollten read-only sein und keine versteckten Domain-Callbacks auslösen.",
        "Hoch",
        "Transaktionsgrenzen entscheiden über Konsistenz, Nebenläufigkeit und Testbarkeit.",
        "Sehr hoch",
        "@Transactional\nclass ContractService extends AbstractExtendedBaseDomainService<Contract> {\n    Contract delete(Contract domainObject) { ... }\n}",
        "@Transactional\nvoid cancelAccession(CancelAccessionCommand command) { ... }\n\n@Transactional(readOnly = true)\nContractAccessionPage page(Filter filter) { ... }",
        "Die Klasse als Ganzes ist transaktional, obwohl einzelne Methoden sehr unterschiedliche Semantik haben.",
        "Transaktionen sollten die fachliche Operation ausdrücken. Das ist für Review und AI deutlich präziser.",
      ),
      projectRow(
        "Actuator, Logs und Metriken",
        [0, 20, 80],
        "RevidaCon hat Jobs, Imports, externe Systeme und große Tabellen. Ohne Beobachtbarkeit wird ein Rewrite schwer betreibbar.",
        "Spring Boot Actuator, strukturierte Logs und fachliche Metriken sollten früh Teil der Zielarchitektur sein, besonders für Import-Pipelines, Jobs und externe APIs.",
        "Hoch",
        "Beim Rewrite müssen alte und neue Prozesse verglichen werden. Beobachtbarkeit hilft, Unterschiede und Produktionsprobleme schnell zu finden.",
        "Mittel",
        "log.error('accession with id ' + obj.id + ' failed validation')\nnew Exception().printStackTrace()",
        "log.warn(\"accession_validation_failed accessionId={} rule={} value={}\", id, rule, value);\nregistry.counter(\"imports.validation.failed\", Tags.of(\"type\", type)).increment();",
        "Der IST-Code nutzt teils ad-hoc Logging und Stacktraces für Validierungsfälle.",
        "Der SOLL-Code sollte strukturierte Events und Metriken erzeugen, die Betrieb und Migration unterstützen.",
      ),
    ],
  },
  {
    id: "java-groovy",
    label: "Java & Groovy",
    subtitle: "Dynamik reduzieren, Typen und Verträge für AI nutzbar machen.",
    rows: [
      projectRow(
        "Groovy-Dynamik im Kernbackend",
        [75, 20, 5],
        "RevidaCon nutzt Groovy stark dynamisch: `def`, Maps, dynamische Params, Criteria-Closures und Runtime-Resolution. Das macht schnellen Legacy-Code möglich, aber erschwert statische Analyse.",
        "Für den Neubau würde ich Kernlogik in Java oder streng typisiertem Kotlin/Java schreiben. Groovy sollte nicht das Fundament neuer Fachlogik sein.",
        "Sehr hoch",
        "AI und Menschen profitieren massiv von Typen, klaren Methoden und Compilerfeedback. Der aktuelle Stil versteckt viele Verträge.",
        "Sehr hoch",
        "def ajaxDoAction() {\n    Map additionalParams = JsonUtil.parseJsonStringToMap(params.additionalData)\n    contractAccessionService.doActionOnAccessions([params.id.toLong()], action, additionalParams)\n}",
        "record DoAccessionActionRequest(long id, long actionId, ActionData data) {}\n\nvoid doAction(DoAccessionActionRequest request, CurrentUser user) { ... }",
        "Der IST-Code akzeptiert dynamische Maps und Params. Fehler erscheinen oft erst zur Laufzeit.",
        "Der SOLL-Code macht Eingaben als Typen sichtbar. Das hilft Tests, OpenAPI und AI-generierten Änderungen.",
      ),
      projectRow(
        "Statische Typisierung für DTOs und Commands",
        [0, 5, 95],
        "DTOs, Commands und Query-Filter sind im Rewrite zentrale Verträge. Sie sollten strikt typisiert sein.",
        "Java Records passen sehr gut für API-Antworten, Commands, Filter und Exportmodelle. Sie sollten bevorzugt werden, solange keine komplexe Objektidentität gebraucht wird.",
        "Sehr hoch",
        "Typisierte Verträge reduzieren Missverständnisse zwischen Backend, Frontend, Tests und AI.",
        "Sehr hoch",
        "Map result = [success: true, actionTitle: actionTitle, data: marshallResult.data]\nrender result as JSON",
        "record ContractAccessionModalResponse(\n    boolean success,\n    String actionTitle,\n    List<AccessionRow> data,\n    Map<String, State> stateMap\n) {}",
        "Der IST-Code baut JSON oft über Maps zusammen.",
        "Der SOLL-Code hat einen expliziten Antwortvertrag, der dokumentiert, getestet und exportiert werden kann.",
      ),
      projectRow(
        "Enums statt persistenter SelectTwo-Service-Klassen",
        [15, 65, 20],
        "RevidaCon enthält viele EnumSelectTwoServices. Manche bilden echte fachliche Wertemengen ab, andere sind UI-Hilfsstrukturen für Select2.",
        "Fachliche Wertemengen sollten als Enums oder Referenztabellen modelliert werden. UI-Auswahllisten sollten aus API-Endpunkten entstehen, nicht als Service-Klasse pro Dropdown.",
        "Mittel",
        "Es gibt sehr viele SelectTwo-Service-Klassen. Beim Rewrite kann das stark vereinfacht werden.",
        "Hoch",
        "class ContractAccessionStatusService extends ...SelectTwoService { ... }\nclass MarketSegmentEnumSelectTwoService { ... }",
        "enum ContractAccessionStatus { PARTICIPATION, CANCELED, OPTED_OUT }\n\nGET /api/reference-data/contract-accession-statuses",
        "Der IST-Code vermischt fachliche Wertemenge und alte UI-Komponente.",
        "Der SOLL-Code trennt Fachmodell von Frontend-Auswahl.",
      ),
      projectRow(
        "Service-Locator und statische getServiceFromContext-Aufrufe",
        [90, 5, 5],
        "Viele Services holen andere Services über statische Helfer. Dadurch werden Abhängigkeiten versteckt und Tests schwerer.",
        "Neue Klassen sollten Konstruktor-Injektion nutzen. Statische Context-Zugriffe sollten nur in Übergangsadaptern existieren, nicht in Fachlogik.",
        "Sehr hoch",
        "Das ist einer der deutlichsten Anti-Patterns für AI-Development in diesem Projekt.",
        "Mittel",
        "private ContractFileService getContractFileService() {\n    return ContractFileService.getServiceFromContext()\n}",
        "class ContractService {\n    ContractService(ContractFileService contractFiles, AuthorizationPolicy authorization) { ... }\n}",
        "Im IST-Code sieht man die echte Abhängigkeit nicht am Klassenrand.",
        "Im SOLL-Code kann AI und Reviewer sofort erkennen, welche Kollaboratoren relevant sind.",
      ),
      projectRow(
        "Null/Map/def durch explizite Optionalität ersetzen",
        [10, 65, 25],
        "Im Legacy-Code sind `null`, leere Strings, Magic Dates und dynamische Maps häufig. Das ist typisch für ältere Grails-Anwendungen.",
        "Im Neubau sollten optionale Werte explizit modelliert werden: nullable API-Felder bewusst, Commands validiert, interne Logik mit klaren Typen.",
        "Hoch",
        "Viele Fehler in alten Systemen entstehen nicht aus Algorithmen, sondern aus unklaren Zuständen.",
        "Hoch",
        "if( params.startDate == \"01.01.0001 00:00:00\" ) {\n    params.startDate = null\n}",
        "record AccessionFilter(Optional<Instant> startDate, Optional<Instant> endDate) {}\n\n@AssertTrue boolean hasValidRange() { ... }",
        "Der IST-Code nutzt Sentinel-Werte und mutable Params.",
        "Der SOLL-Code macht Optionalität und Validierung explizit.",
      ),
    ],
  },
  {
    id: "architecture-patterns",
    label: "Muster & AI-Workflow",
    subtitle: "Welche Programmiermuster beim Neubau helfen oder schaden.",
    rows: [
      projectRow(
        "Vertical Slice Architecture",
        [0, 15, 85],
        "Für RevidaCon ist Vertical Slice besonders passend, weil sehr viele fachliche Abläufe durch alte technische Schichten laufen.",
        "Der Rewrite sollte pro Use Case geschnitten werden: ContractAccession anzeigen, Aktion ausführen, Import prüfen, Datei abrufen, Export erzeugen.",
        "Sehr hoch",
        "Dadurch bekommen AI und Reviewer genau den Kontext, den sie für eine Änderung brauchen.",
        "Sehr hoch",
        "ContractAccessionController -> BaseController -> ContractAccessionService -> BackboneService -> Domain -> GSP/Backbone",
        "features/accessions/action\n  AccessionActionController\n  AccessionActionService\n  AccessionActionRepository\n  AccessionActionResponse",
        "Der IST-Pfad verteilt einen Ablauf über sehr viele historische Stellen.",
        "Der SOLL-Pfad bündelt den Ablauf ohne gemeinsame Regeln zu duplizieren.",
      ),
      projectRow(
        "Base Classes als Standardmuster",
        [90, 10, 0],
        "BaseController und BaseService sind in RevidaCon extrem häufig. Sie reduzieren Boilerplate, verstecken aber Verhalten.",
        "Beim Neubau sollten Basisklassen nicht als Standard zurückkommen. Wiederverwendung lieber über Komposition, kleine Helper oder explizite Modulservices.",
        "Sehr hoch",
        "Die alten Basisklassen sind wahrscheinlich einer der Hauptgründe für die Unübersichtlichkeit.",
        "Sehr hoch",
        "class ImportProductController extends AbstractExtendedBaseDomainController<ImportProduct> { ... }",
        "class ImportProductController {\n    private final ImportProductPage page;\n    private final ImportProductCommandHandler commands;\n}",
        "Der IST-Code erbt Verhalten, das man für Review erst suchen muss.",
        "Der SOLL-Code zeigt Verantwortung und Abhängigkeiten direkt.",
      ),
      projectRow(
        "DRY bei fachlichen Regeln, nicht bei jeder CRUD-Form",
        [5, 75, 20],
        "RevidaCon wirkt stark DRY über generische CRUD-/Backbone-Abstraktionen. Das spart Code, erzeugt aber hohe kognitive Kopplung.",
        "Im Neubau sollten fachliche Regeln zentral bleiben, aber ähnliche Controller- oder Tabellenformen dürfen lokal verständlich sein.",
        "Hoch",
        "Zu aggressive Wiederverwendung erschwert AI-Änderungen, weil kleine Anpassungen alte Framework-Pfade berühren.",
        "Sehr hoch",
        "AbstractExtendedBaseDomainController<T>\nAbstractExtendedBaseDomainService<T>\nTableConfigStorageDatatablesMarshaller<T>",
        "void assertCanChangeAccessionStatus(...) { ... }\n\n// lokale API-Methoden dürfen ähnlich aussehen, wenn sie klar bleiben.",
        "Der IST-Code abstrahiert technische Formen stark.",
        "Der SOLL-Code abstrahiert gemeinsame fachliche Wahrheit, nicht jedes Formularmuster.",
      ),
      projectRow(
        "CQRS-light für Listen und Schreibaktionen",
        [5, 50, 45],
        "RevidaCon hat sehr komplexe Listen, Filter und Tabellen plus fachliche Schreibaktionen. Ein einziges Domainmodell für alles ist zu schwer.",
        "Ich würde kein großes CQRS-System bauen, aber Lese- und Schreibmodelle innerhalb des Backends bewusst trennen.",
        "Hoch",
        "Damit werden große Tabellen performanter und Schreibregeln klarer testbar.",
        "Hoch",
        "ContractAccession Domain wird für Tabellen, Modal, Aktionen, Validierung und Statusberechnung genutzt.",
        "record AccessionTableRow(...)\nrecord ChangeAccessionStatusCommand(...)\n\nclass AccessionQueries {}\nclass AccessionCommands {}",
        "Der IST-Code nutzt Domainobjekte für viele unterschiedliche Zwecke.",
        "Der SOLL-Code erlaubt optimierte Read Models und klare Commands.",
      ),
      projectRow(
        "AI-Workflow mit Export + Akzeptanztests",
        [0, 5, 95],
        "Für RevidaCon sollte AI nicht nur Code generieren, sondern innerhalb eines vorgegebenen Architekturrahmens arbeiten.",
        "Jeder Slice sollte den Modern-Coding-Export, echte Legacy-Beispiele, gewünschte API-Verträge und Akzeptanztests als Kontext bekommen.",
        "Sehr hoch",
        "Das verhindert, dass AI den alten Grails/Backbone-Stil kopiert.",
        "Niedrig",
        "Prompt: \"Baue ContractAccession neu\"\n// ohne Regeln übernimmt AI wahrscheinlich Controller/Service/Entity-Struktur.",
        "Prompt enthält:\n- RevidaCon Architektur-Export\n- Slice-Ziel\n- erlaubte Dependencies\n- Testfälle\n- Beispielantworten",
        "Ohne Kontext ist die Legacy-Struktur das naheliegendste Trainingssignal.",
        "Mit explizitem Export wird AI auf die Zielarchitektur ausgerichtet.",
      ),
    ],
  },
  {
    id: "dependencies",
    label: "Dependencies",
    subtitle: "Welche Abhängigkeiten beim Neubau bleiben, ersetzt oder gestrichen werden sollten.",
    rows: [
      projectRow(
        "Grails/GORM/Hibernate als Kernplattform",
        [70, 25, 5],
        "Das aktuelle Projekt nutzt Grails 6, GORM/Hibernate, GSP, Asset Pipeline und viele Grails-Plugins als Anwendungsfundament.",
        "Für einen kompletten modernen Rewrite würde ich Grails nicht als Zielplattform wählen. Spring Boot mit expliziten APIs, JDBC/jOOQ oder gezielt JPA wäre für AI-Review und langfristige Wartung besser nachvollziehbar.",
        "Sehr hoch",
        "Die Plattform bestimmt fast alle weiteren Muster: Controller, Domain-Entities, Plugins, UI-Auslieferung und Tests.",
        "Sehr hoch",
        "implementation \"org.grails:grails-web-boot\"\nimplementation(\"org.grails.plugins:hibernate5:8.1.1\")\nimplementation \"org.grails.plugins:database-migration:4.2.1\"",
        "Spring Boot 3 / Java 21+\nFlyway oder Liquibase\nJDBC, jOOQ oder gezielt JPA pro Modul\nREST/OpenAPI als primärer Vertrag",
        "Grails bringt viel Magie und Konvention mit. Das war früher produktiv, erschwert aber heute Kontextkontrolle und gezielten Rewrite.",
        "Die Zielplattform sollte explizite Verträge, klare Startup-Konfiguration und gut testbare Slices unterstützen.",
      ),
      projectRow(
        "AOE-interne Plugin-Wolke",
        [55, 35, 10],
        "Das Projekt hängt stark an internen AOE-Bibliotheken wie aoe-base, aoe-backbone, aoe-file-manager, aoe-security-manager, aoe-datatables und weiteren.",
        "Beim Rewrite sollten diese Abhängigkeiten nicht pauschal übernommen werden. Jede muss eine konkrete Fähigkeit rechtfertigen: Security, File Storage, Tabellenkonfiguration, PDF, Messaging usw.",
        "Sehr hoch",
        "Interne Plugins sind ein großer Lock-in- und Verständnisfaktor. Ohne klare Entscheidung baut man den alten Framework-Unterbau erneut.",
        "Sehr hoch",
        "implementation \"de.cse.aoe.grails:aoe-backbone:cse-4.2.0.0\"\nimplementation \"de.cse.aoe.grails:aoe-file-manager:cse-4.0.0.5\"\nimplementation \"de.cse.aoe.grails:aoe-security-manager:cse-4.1.0.1\"",
        "interface ObjectStorage { ... }\ninterface AuthorizationPolicy { ... }\n\n// AOE-Fähigkeiten nur als Adapter übernehmen, nicht als Architekturzentrum.",
        "Aktuell bilden viele interne Plugins die eigentliche Plattform. Das macht Codeverstehen abhängig von fremdem Framework-Wissen.",
        "Im Neubau sollten wir Fähigkeiten als kleine Provider-Grenzen definieren und nur nötige Implementierungen anbinden.",
      ),
      projectRow(
        "Mehrere Datenbanktreiber",
        [60, 30, 10],
        "Das Projekt enthält PostgreSQL, MSSQL und MySQL-Treiber. Das kann historisch gewachsen oder integrationsbedingt sein.",
        "Für den neuen Kern sollte genau eine primäre relationale Datenbank festgelegt werden. Weitere Datenbanken gehören in explizite Integrationsadapter.",
        "Hoch",
        "Mehrere DB-Treiber erhöhen Testmatrix, Konfigurationsaufwand und Unsicherheit bei SQL-Verhalten.",
        "Mittel",
        "implementation 'org.postgresql:postgresql:42.7.7'\nimplementation 'com.microsoft.sqlserver:mssql-jdbc:7.2.2.jre8'\nimplementation 'com.mysql:mysql-connector-j:8.0.33'",
        "runtimeOnly 'org.postgresql:postgresql'\n\ninterface ExternalCatalogClient { ... }\n// MSSQL/MySQL nur in getrennten Adaptermodulen, falls fachlich nötig.",
        "Die Build-Datei zeigt mehrere mögliche Datenbankwelten im selben Backend.",
        "Die neue Architektur sollte zwischen eigener Persistenz und Fremdsystem-Zugriff unterscheiden.",
      ),
      projectRow(
        "PDF/Excel/CSV als explizite Import/Export-Module",
        [5, 35, 60],
        "PDF, Excel und CSV sind fachlich wichtig: Preislisten, Vertragsdokumente, VTV/PQV-Dateien, Fehlerprotokolle und Exporte.",
        "Diese Fähigkeiten sollten bleiben, aber isoliert werden. Parsing, Validierung, Fehlerreporting und Persistenz sollten nicht in generischen Controllern verschwimmen.",
        "Hoch",
        "Import/Export scheint ein Kernprozess zu sein und ist für einen Rewrite besonders test- und datenintensiv.",
        "Hoch",
        "implementation 'org.apache.poi:poi-ooxml:4.1.2'\nimplementation 'org.apache.commons:commons-csv:1.14.1'\nimplementation 'org.apache.pdfbox:pdfbox:2.0.36'",
        "modules/imports\n  PriceImportParser\n  ImportValidationReport\nmodules/exports\n  ContractExportService\n\n// Parser-Tests mit realistischen Fixtures",
        "Die Dependencies sind grundsätzlich sinnvoll, aber aktuell Teil eines sehr breiten Monolithen.",
        "Im Neubau sollten Datei-Formate eigene Modulgrenzen und testbare Verträge bekommen.",
      ),
    ],
  },
  {
    id: "persistence",
    label: "Persistence & Entities",
    subtitle: "GORM-Domain-Modell kritisch für den Rewrite bewerten.",
    rows: [
      projectRow(
        "JPA-Entities als 1:1-Ersatz für GORM-Domains",
        [80, 15, 5],
        "Die naheliegende, aber gefährliche Migration wäre: jede GORM-Domainklasse wird eine JPA-Entity. Bei RevidaCon würde das ein großes, historisch gewachsenes Objektmodell konservieren.",
        "Ich würde JPA-Entities nicht als Standardersatz verwenden. Für einige echte Aggregate können Entities sinnvoll sein; Listen, Reports, Importe und API-Antworten sollten eigene Modelle/Queries bekommen.",
        "Sehr hoch",
        "Das ist eine der wichtigsten Rewrite-Entscheidungen. Sie entscheidet, ob der neue Code wirklich besser wird oder nur modernere Syntax für alte Kopplung bekommt.",
        "Sehr hoch",
        "class ContractAccession {\n    static belongsTo = [partnerLocationIk: PartnerLocationIK, contractUuid: ContractUuid]\n    static hasMany = [statusChanges: ContractAccessionStatusChange]\n}",
        "@Entity\nclass ContractAccessionAggregate { ... }\n\nrecord ContractAccessionListRow(long id, String ik, String contractName, String status) {}",
        "Der IST-Code nutzt GORM-Domains für Persistenz, Beziehungen, Validierung und Fachlogik gleichzeitig.",
        "Der SOLL-Code trennt Aggregate für Schreibregeln von Read Models für API/Tabellen.",
      ),
      projectRow(
        "Repository pro Entity",
        [70, 25, 5],
        "Bei 274 Domain-Klassen würde ein Repository pro Entity eine riesige neue Durchreichschicht erzeugen.",
        "Repositories sollten pro Use Case oder Aggregate-Grenze entstehen. Reine CRUD-Repositories für jede Tabelle helfen hier kaum.",
        "Hoch",
        "Zu viele Repositories würden AI und Menschen wieder durch viele Dateien schicken, ohne Verantwortung zu gewinnen.",
        "Sehr hoch",
        "interface ContractAccessionRepository extends JpaRepository<ContractAccessionEntity, Long> {}\ninterface ContractUuidRepository extends JpaRepository<ContractUuidEntity, Long> {}",
        "class ContractAccessionQueries {\n    Page<AccessionRow> search(AccessionFilter filter, UserScope scope) { ... }\n}\n\nclass ContractAccessionCommands { ... }",
        "Der IST-Nachbau wäre formal sauber, aber nicht fachlich hilfreicher.",
        "Der SOLL-Schnitt orientiert sich an Lesen, Schreiben und fachlichen Grenzen.",
      ),
      projectRow(
        "DTOs und API-Records",
        [0, 15, 85],
        "RevidaCon braucht sehr viele Antwortformen: Tabellenzeilen, Modals, Importberichte, Statusänderungen, Datei-Metadaten und Referenzdaten.",
        "DTOs/Records sollten explizit und nahe am Use Case stehen. Alte Marshalling-Maps sollten nicht übernommen werden.",
        "Sehr hoch",
        "Klare DTOs sind für neues Frontend, OpenAPI, Tests und AI-Codegen zentral.",
        "Hoch",
        "Map result = [success: true, data: marshallResult.data, stateMap: marshallResult.stateMap]\nrender result as JSON",
        "record AccessionActionPreview(\n    boolean success,\n    List<AccessionActionRow> data,\n    AccessionActionState state\n) {}",
        "Aktuell entstehen Verträge oft implizit über Maps und Marshaller.",
        "Im Rewrite sollten Verträge typisiert und dokumentierbar sein.",
      ),
      projectRow(
        "Separate Mapper/Marshaller-Klassen",
        [40, 45, 15],
        "RevidaCon nutzt viele Marshaller für Backbone, Datatables und TableConfigStorage. Manche kapseln echte Komplexität, andere verstecken nur Felder.",
        "Beim Neubau sollten einfache Mappings lokal bleiben. Komplexe, wiederverwendete Projektionen dürfen eigene Mapper bekommen, aber nicht als genereller Zwang.",
        "Mittel",
        "Mapping ist häufig, aber nicht jedes Mapping rechtfertigt eine Klasse. Zu viele Mapper verlängern Änderungspfade.",
        "Hoch",
        "contractAccessionService.createTableConfigStorageMarshaller(storageName, params)\nmarshallForBackbone(instance)",
        "return new AccessionRow(\n    rs.getLong(\"id\"),\n    rs.getString(\"ik\"),\n    rs.getString(\"contract_name\")\n);",
        "Der IST-Code enthält frameworkgebundene Marshaller.",
        "Der SOLL-Code hält kleine Projektionen nahe an Query/API und lagert nur echte Komplexität aus.",
      ),
      projectRow(
        "274 GORM-Domain-Klassen",
        [65, 30, 5],
        "RevidaCon hat viele GORM-Domain-Klassen. Sie enthalten Datenstruktur, Constraints, Mapping, Beziehungen, Callback-Logik und teilweise fachliche Berechnungen.",
        "Beim Neubau sollten die Tabellen und fachlichen Begriffe bleiben, aber die Domain-Klassen nicht automatisch als JPA/GORM-Entities übernommen werden. Für API-Lesen und komplexe Filter sind SQL-nahe Read Models oft besser.",
        "Sehr hoch",
        "Das Persistenzmodell ist der Kern des Rewrite-Risikos. Wenn wir das alte Entity-Netz kopieren, bleibt die Komplexität erhalten.",
        "Sehr hoch",
        "class ContractAccession {\n    static belongsTo = [partnerLocationIk: PartnerLocationIK, contractUuid: ContractUuid]\n    static hasMany = [statusChanges: ContractAccessionStatusChange]\n    static constraints = { ... }\n}",
        "record ContractAccessionPageRow(long id, String ik, String contractName, String status) {}\n\nreturn jdbc.query(sql, rowMapper, filters...);",
        "Das aktuelle Modell koppelt Beziehungen, Validierung und Lebenszyklus an GORM-Domain-Objekte.",
        "Der Rewrite sollte zwischen Schreibmodell, Lesemodell und API-Antwort unterscheiden. Entities nur dort verwenden, wo ein echtes Aggregate sinnvoll ist.",
      ),
      projectRow(
        "Domain-Callbacks und abgeleiteter Zustand",
        [70, 25, 5],
        "Domain-Klassen nutzen `beforeUpdate`, `beforeInsert`, transiente Getter und Statusberechnungen. Das versteckt Seiteneffekte im Persistenzlebenszyklus.",
        "Für AI-Entwicklung sollten Änderungen an Status, Prüfungen und Fristen explizite Use Cases sein, nicht versteckte Entity-Callbacks.",
        "Sehr hoch",
        "Callbacks sind schwer zu finden und können bei Migrationen oder Tests unerwartete Nebenwirkungen erzeugen.",
        "Hoch",
        "boolean beforeUpdate() {\n    updateAllRequirementsChecked()\n    updateAllRequirementsCheckedUntil()\n    modified = new Date()\n}",
        "@Transactional\nvoid recalculateRequirementState(long accessionId) {\n    var state = rules.evaluate(accessionId);\n    accessions.updateRequirementState(accessionId, state);\n}",
        "Aktuell passieren fachliche Änderungen automatisch beim Speichern.",
        "Im Neubau sollten solche Änderungen als benannte Use Cases und Tests sichtbar sein.",
      ),
      projectRow(
        "Criteria-/GORM-Queries in Services",
        [35, 55, 10],
        "Viele Services bauen dynamische Criteria-Queries. Das ist flexibel, aber schwer zu analysieren und oft eng an GORM gebunden.",
        "Für neue APIs sollten komplexe Listen/Filter als explizite Query-Objekte oder SQL/jOOQ-Abfragen modelliert werden. Wichtig sind messbare Pläne, Indizes und klare Parameter.",
        "Hoch",
        "Listen, Filter und Berechtigungen sind zentrale UI-Funktionen. Sie bestimmen Performance und Korrektheit.",
        "Hoch",
        "protected void additionalFiltering(HibernateCriteriaBuilder hcb, Map params) {\n    if(params.additionalParams.status) {\n        hcb.in(\"cuuid.status\", params.additionalParams.status)\n    }\n}",
        "SELECT ...\nFROM contract_accession ca\nJOIN contract_uuid cu ON cu.id = ca.contract_uuid_id\nWHERE (:status IS NULL OR cu.status = ANY(:status))\n  AND ca.deleted = false",
        "Criteria-Code ist oft über Basisklassen, Params und Aliase verteilt.",
        "Explizite Queries sind für AI, Review und Performanceanalyse besser greifbar.",
      ),
    ],
  },
  {
    id: "backend-api",
    label: "Backend & API",
    subtitle: "Controller, Services, Berechtigungen und API-Verträge neu schneiden.",
    rows: [
      projectRow(
        "252 generische Base-/Backbone-Controller",
        [80, 15, 5],
        "Sehr viele Controller erben von generischen Base-Domain-Controllern oder Backbone-Controllern. Dadurch steckt Verhalten außerhalb der konkreten Datei.",
        "Beim Rewrite sollten keine BaseController als Standard entstehen. Controller sollen konkrete HTTP-Verträge haben und Use Cases aufrufen.",
        "Sehr hoch",
        "Das ist einer der stärksten Gründe, warum der aktuelle Code schwer zu verstehen ist.",
        "Sehr hoch",
        "class ContractAccessionController extends AbstractExtendedBaseDomainController<ContractAccession> {\n    def ajaxDTList() { ... }\n}",
        "@GetMapping\nContractAccessionPage list(ContractAccessionFilter filter, CurrentUser user) {\n    return listAccessions.handle(filter, user);\n}",
        "Der IST-Code versteckt Standardverhalten und mischt UI-Ajax, Tabellenlogik und Fachaktionen.",
        "Der SOLL-Code macht den API-Vertrag und den Use Case direkt sichtbar.",
      ),
      projectRow(
        "Service-Locator / getServiceFromContext",
        [85, 10, 5],
        "An vielen Stellen werden Services über statische Helfer oder den Grails ApplicationContext geholt. Das verschleiert Abhängigkeiten.",
        "Im neuen Code sollten Abhängigkeiten über Konstruktoren sichtbar sein. Das hilft Tests, AI-Kontext und Review.",
        "Sehr hoch",
        "Versteckte Abhängigkeiten sind Gift für nachvollziehbare Änderungspfade.",
        "Mittel",
        "private UserService getUserService() {\n    return UserService.getServiceFromContext()\n}",
        "class ContractService {\n    ContractService(UserService users, ContractFileService files) { ... }\n}",
        "Im aktuellen Code sieht man nicht zuverlässig am Konstruktor, was ein Service braucht.",
        "Konstruktor-Injektion macht die Kollaboratoren und Modulgrenzen sichtbar.",
      ),
      projectRow(
        "Berechtigungen nahe am Use Case",
        [5, 60, 35],
        "RevidaCon hat komplexe Rollen, Partner-/IK-Sichtbarkeit und objektbezogene Rechte. Das darf nicht vereinfacht werden.",
        "Berechtigungen sollten im Rewrite explizit am Use Case oder Query-Pfad modelliert werden. Rollen allein reichen nicht.",
        "Sehr hoch",
        "Falsche Berechtigungen wären ein schwerwiegender fachlicher und rechtlicher Fehler.",
        "Sehr hoch",
        "if( Authority.has(Authority.ROLE_ADMIN) ) return true\nSet<Long> userIds = listAccessibleUserIdsForCurrentUser(params.permissionParams)",
        "authorization.assertCanReadAccession(user, accessionId)\n\nWHERE ca.partner_id = ANY(:accessiblePartnerIds)",
        "Aktuell sind Berechtigungen teils in Services, Criteria und Hilfsklassen verteilt.",
        "Im Neubau sollte jede API ihre Berechtigungsregel sichtbar und testbar machen.",
      ),
      projectRow(
        "REST/OpenAPI als primärer Vertrag",
        [0, 30, 70],
        "Es gibt bereits neuere REST-API-Ansätze unter `src/main/groovy/de/cse/api/v2`, aber große Teile laufen noch über Grails/Backbone/Ajax.",
        "Für den Neubau sollte OpenAPI-first oder zumindest OpenAPI-sichtbar gearbeitet werden. Das ist ideal für AI, Frontend und Tests.",
        "Hoch",
        "Ein sauberer API-Vertrag verhindert, dass Frontend und Backend wieder implizit über GSP/Backbone gekoppelt werden.",
        "Mittel",
        "@RestController\n@RequestMapping(\"/restApi/v2/file\")\nclass FileApiController {\n    @GetMapping(\"/get\") ResponseEntity<FileGetResponse> get(...) { ... }\n}",
        "@Tag(name = \"Contract Accessions\")\n@GetMapping(\"/api/contracts/accessions\")\nContractAccessionPage page(@Valid ContractAccessionFilter filter) { ... }",
        "Der v2-API-Stil ist ein besserer Ansatz, nutzt aber noch Service-Locator und ist nicht der Hauptpfad.",
        "Der Rewrite sollte diesen Weg konsequent machen: typed requests, typed responses, OpenAPI, Tests.",
      ),
    ],
  },
  {
    id: "frontend-legacy",
    label: "Frontend Legacy",
    subtitle: "GSP/Backbone nicht portieren, sondern Oberfläche neu schneiden.",
    rows: [
      projectRow(
        "Backbone/GSP UI",
        [90, 10, 0],
        "Das Projekt enthält sehr viele GSP-Views und Backbone-Modelle/Views/Collections. Diese UI ist historisch gewachsen und eng an Grails-Controller gekoppelt.",
        "Für einen modernen Rewrite sollte diese UI nicht migriert werden. Besser: neues Frontend mit klaren API-Verträgen und fachlichen Screens.",
        "Sehr hoch",
        "Die alte UI-Struktur ist ein großer Komplexitätstreiber. Ein Neubau bietet hier den größten Qualitätsgewinn.",
        "Sehr hoch",
        "var ContractUuid = AoeModel.extend({\n    urlRoot: AoeEnvironment.createUrl(\"contractUuidBackbone\"),\n    defaults: { contractLegs: null, requirementOverview: null }\n});",
        "type ContractUuid = {\n  id: number;\n  name: string;\n  status: ContractStatus;\n}\n\nconst { data } = useContractUuid(id);",
        "Backbone-Modelle spiegeln große Backend-Objekte und bauen komplexe Client-Zustände manuell zusammen.",
        "Ein neues Frontend sollte kleine, typisierte View Models vom Backend bekommen und Interaktion lokal kontrollieren.",
      ),
      projectRow(
        "Servergerenderte Tabellen und Ajax-Fragmente",
        [80, 15, 5],
        "Viele Controller rendern Templates für Tabellenfragmente. Das koppelt Filter, Darstellung und Datenzugriff eng an Grails.",
        "Beim Neubau sollten Tabellen über API-Endpunkte mit klaren Filter-/Sortierverträgen laufen. Die UI rendert selbst.",
        "Hoch",
        "Tabellen scheinen zentral für die Anwendung. Gerade dort brauchen Nutzer schnelle, verständliche und testbare Workflows.",
        "Sehr hoch",
        "render(template: \"/contractAccession/templates/listTableContent\", model: [storageId: params.filter])",
        "GET /api/contracts/accessions?status=ACTIVE&page=1&sort=modified\n\nreturn new PageResponse<AccessionRow>(items, pageInfo);",
        "Der IST-Code liefert HTML-Fragmente statt stabiler Datenverträge.",
        "Der SOLL-Code trennt Datenvertrag und Darstellung. Das ist besser für moderne Frontends und AI-gestützte Änderungen.",
      ),
      projectRow(
        "Table-Config als Produktfunktion prüfen",
        [20, 55, 25],
        "TableConfigStorage scheint eine echte Nutzerfunktion zu sein: gespeicherte Spalten, Tabellenkonfiguration und Exporte.",
        "Diese Fähigkeit sollte fachlich bewertet und wahrscheinlich neu gebaut werden, aber nicht als altes Plugin übernommen werden.",
        "Mittel",
        "Wenn Nutzer stark mit Tabellen arbeiten, ist das wichtig. Es sollte aber nicht die neue Architektur dominieren.",
        "Hoch",
        "tableConfigStorageService.readTableConfigStorageFields(storageId)\ncontractAccessionService.createTableConfigStorageMarshaller(storageName, ...)",
        "record TableViewConfig(List<String> columns, Sort sort, Filter filter) {}\n\nGET /api/table-configs/{viewKey}",
        "Aktuell steckt Tabellenkonfiguration tief in Controller/Service-Marshalling.",
        "Neu sollte es ein eigenes, kleines Feature mit Vertrag und Tests werden.",
      ),
    ],
  },
  {
    id: "integrations-jobs",
    label: "Integrationen & Jobs",
    subtitle: "Importe, Dateien, Messaging und Hintergrundprozesse isolieren.",
    rows: [
      projectRow(
        "Import-Jobs und Fehlerprotokolle",
        [5, 35, 60],
        "ImportTask, ImportProduct, PriceImport, PQV/HMV/VTV und Fehlerprotokolle wirken fachlich zentral.",
        "Diese Prozesse sollten bleiben, aber als Pipeline modelliert werden: Upload, Parsing, Validierung, Review, Commit, Report.",
        "Sehr hoch",
        "Beim Rewrite sind Importe ein Kernrisiko, weil sie Datenqualität und Fachregeln bündeln.",
        "Hoch",
        "ImportTaskService\nImportProductPriceService\nImportTaskErrorProtocolPdfService",
        "ImportPipeline\n  parse(file)\n  validate(rows)\n  preview(errors)\n  commit(validRows)\n  exportReport()",
        "Aktuell sind Import-Fähigkeiten über viele Services und Domain-Klassen verteilt.",
        "Eine Pipeline macht Zustände und Fehler für Nutzer, Tests und AI deutlich besser handhabbar.",
      ),
      projectRow(
        "File Storage und Google Cloud Storage",
        [0, 45, 55],
        "Dateien sind wichtig: Vertragsdateien, Importdateien, PDF-Reports, Anhänge. Das Projekt nutzt File-Manager und Google Cloud Storage.",
        "Storage sollte als explizite Provider-Grenze bleiben, aber nicht an Grails-Domainmodelle gekoppelt sein.",
        "Hoch",
        "Dateien sind fachlich kritisch und berühren Sicherheit, Audit, Lebenszyklus und Kosten.",
        "Hoch",
        "implementation 'com.google.cloud:google-cloud-storage'\nimplementation \"de.cse.aoe.grails:aoe-file-manager:cse-4.0.0.5\"",
        "interface ObjectStorage {\n    StoredFile read(FileKey key);\n    FileKey put(Upload upload);\n}\n\nclass GcsObjectStorage implements ObjectStorage { ... }",
        "Die Fähigkeit ist wichtig, aber im alten Stack plugin- und domaingebunden.",
        "Im Neubau sollte Storage ein kleiner technischer Provider sein, während Features Berechtigungen und Metadaten besitzen.",
      ),
      projectRow(
        "Quartz/RabbitMQ/Cluster-Jobs",
        [10, 55, 35],
        "Das Projekt enthält Quartz, RabbitMQ und ClusteredJob-Domainklassen. Hintergrundverarbeitung ist real, aber historisch stark im Monolithen verankert.",
        "Für den Rewrite sollten Hintergrundprozesse als explizite Jobs mit Idempotenz, Status, Retry und Observability modelliert werden.",
        "Hoch",
        "Jobs können Daten verändern und externe Systeme ansprechen. Ohne klare Grenzen sind sie schwer zu testen.",
        "Mittel",
        "implementation 'org.grails.plugins:quartz:3.0.0'\nimplementation 'org.grails.plugins:rabbitmq-native:3.5.1'\nclass ClusteredJob { ... }",
        "record JobRun(id, type, status, startedAt, finishedAt) {}\n\njobRunner.run(new ImportPricesJob(fileId));",
        "Aktuell sieht man verschiedene Mechanismen für Hintergrundarbeit.",
        "Neu sollte ein einheitliches Job-Modell mit klaren Zuständen und Tests entstehen.",
      ),
    ],
  },
  {
    id: "tests-migration",
    label: "Tests & Migration",
    subtitle: "Rewrite absichern statt alten Code nur nachzubauen.",
    rows: [
      projectRow(
        "Characterization Tests vor Rewrite",
        [0, 20, 80],
        "Bei chaotischem Legacy-Code sind Charakterisierungstests wichtig: Sie dokumentieren, was heute fachlich passieren muss, auch wenn der Code schlecht ist.",
        "Vor jedem Modul-Rewrite sollten Kernfälle gegen aktuelle Fixtures oder Datenextrakte festgehalten werden.",
        "Sehr hoch",
        "Ohne solche Tests merkt man erst spät, dass der Neubau fachliche Sonderfälle verloren hat.",
        "Mittel",
        "src/test/groovy/de/cse/aoe/rv/contractAccession/ContractAccessionServiceIntSpec.groovy\nsrc/test/resources/pqv/*.xlsx",
        "@Test\nvoid importedPriceRowsProduceExpectedValidationErrors() {\n    var report = importPipeline.preview(file);\n    assertThat(report.errors()).contains(...);\n}",
        "Es gibt Tests und reale Testressourcen, aber sie sind noch nicht als Rewrite-Vertrag strukturiert.",
        "Der Neubau sollte pro Modul Akzeptanztests aus realen Legacy-Fällen bekommen.",
      ),
      projectRow(
        "Schema-Migration als eigenes Projekt",
        [0, 45, 55],
        "Die Datenbank ist groß und historisch. Es gibt Migrationen, aber der Rewrite braucht zusätzlich eine Datenübernahme-Strategie.",
        "Für den Neubau sollte früh entschieden werden: neues Schema, Migrationsskripte, Parallelbetrieb, Read-only-Vergleich oder Big-Bang.",
        "Sehr hoch",
        "Datenmigration ist bei 274 Domain-Klassen und vielen Beziehungen wahrscheinlich der größte operative Risikoblock.",
        "Hoch",
        "grails-app/migrations\nstatic mapping = { table \"contract_accession\" }",
        "migrations/\n  V001__target_schema.sql\n  V100__import_legacy_contracts.sql\n\nlegacy_diff_tests/",
        "Aktuell ist das Schema an GORM-Mapping und alte Migrationen gekoppelt.",
        "Die neue Datenmigration sollte unabhängig testbar sein und fachliche Prüfberichte erzeugen.",
      ),
      projectRow(
        "AI-Startkontext aus Architekturentscheidungen",
        [0, 10, 90],
        "Die hier erstellte Projektmatrix soll nicht nur Doku sein. Sie ist ein Arbeitsvertrag für AI-gestützte Umsetzung.",
        "Für jeden Rewrite-Slice sollte die AI den Export dieser Matrix plus Modul-Akzeptanztests bekommen. So sind Prioritäten, No-Gos und Zielmuster direkt sichtbar.",
        "Hoch",
        "Das reduziert die Gefahr, dass AI alte Muster kopiert oder wichtige Projektentscheidungen ignoriert.",
        "Niedrig",
        "Prompt: \"Rewrite ContractAccessionController in Spring Boot\"\n// Ohne Kontext kopiert AI wahrscheinlich die alte Controller-Struktur.",
        "Prompt enthält:\n- RevidaCon-Analyse-Export\n- Modulziel\n- Akzeptanztests\n- erlaubte Dependencies\n- gewünschte API-Verträge",
        "Ohne explizite Leitplanken tendiert AI dazu, sichtbare Legacy-Muster fortzuschreiben.",
        "Mit Export und Tests kann AI zielgerichtet neu bauen statt nur zu übersetzen.",
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
        label: "Frontend: Next.js, React & Web",
        subtitle: "Rendering, Komponenten, TypeScript, HTML, CSS, Daten, Tests und AI-Workflow.",
        topics: globalFrontendTopics,
      },
    ],
  },
  {
    id: "revidacon",
    label: "RevidaCon",
    kind: "project",
    description: "Projektanalyse für den kompletten Rewrite eines großen, veralteten Grails/Groovy-Monolithen.",
    frameworks: [
      {
        id: "backend-rewrite",
        label: "Backend: RevidaCon Rewrite",
        subtitle: "Grails/GORM/Backbone-Monolith analysieren und Zielarchitektur ableiten.",
        topics: relevantRevidaconTopics([
          revidaconFromGlobalTopic(
            springTopics[0],
            "Spring Boot",
            "Globale Spring-Entscheidungen auf RevidaCon angewendet.",
          ),
          revidaconFromGlobalTopic(
            springTopics[1],
            "Java",
            "Globale Java-Entscheidungen auf RevidaCon angewendet.",
          ),
          revidaconFromGlobalTopic(
            springTopics[2],
            "Programmiermuster",
            "Globale Muster auf RevidaCon angewendet.",
          ),
          revidaconFromGlobalTopic(
            springTopics[3],
            "Closures",
            "Globale Lambda-/Closure-Regeln auf RevidaCon angewendet.",
          ),
          ...revidaconBackendTopics,
        ]),
      },
      {
        id: "frontend-rewrite",
        label: "Frontend: RevidaCon Rewrite",
        subtitle: "Backbone/GSP-Abläufe in ein modernes Frontend übersetzen.",
        topics: relevantRevidaconTopics([
          revidaconFromGlobalTopic(
            nextTopics[0],
            "Next.js",
            "Globale Next.js-Entscheidungen auf RevidaCon angewendet.",
          ),
        ]),
      },
    ],
  },
  {
    id: "modern-coding",
    label: "modern-coding",
    kind: "project",
    description: "Beispiel-Repository: Spring Boot Backend und Next.js Präsentationsfrontend.",
    frameworks: [
      {
        id: "spring-java",
        label: "Backend: Spring Boot & Java",
        subtitle: "Einschätzung für ProfileController, ProfileService und die Demo-API.",
        topics: withProjectEvidence("modern-coding", springTopics),
      },
      {
        id: "next",
        label: "Frontend: Next.js",
        subtitle: "Einschätzung für Architektur-Explorer und Präsentationsoberfläche.",
        topics: withProjectEvidence("modern-coding", nextTopics),
      },
    ],
  },
];
export const choices = ["Weglassen", "Neu definieren", "Nutzen"] as const;
export function dominant(scores: Rating["scores"]): number {
  const max = Math.max(...scores);
  return scores.filter((score) => score === max).length > 1
    ? -1
    : scores.indexOf(max);
}
