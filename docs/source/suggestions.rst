Suggestions
==================

Mapping of Crop Labels
----------------------
- Contains a dictionary mapping crop keys to Portuguese labels.
- Used to translate crop identifiers into user-friendly crop names.

Priority CSS Class Function
---------------------------
- Returns the CSS class name according to the priority level.
- Supports 'high', 'medium', 'low', and defaults to empty string.

Priority Label Function
-----------------------
- Provides the Portuguese label for a given priority level.
- Covers 'Alta', 'Média', 'Baixa', or 'Desconhecida' for unknown priorities.

Icon Retrieval Function
-----------------------
- Maps suggestion types to FontAwesome icon classes.
- Supports irrigation, fertilization, pest control, and others.
- Defaults to info-circle icon if type is unknown.

Suggestions Component
---------------------
- React component that consumes WeatherContext to get suggestions and location.
- Displays loading indicator if data is missing or loading.
- Shows a header with crop and city labels.
- Lists suggestion items with icon, title, description, and priority.
- Accessible with ARIA roles and labels.
