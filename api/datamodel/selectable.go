package datamodel

type SQLFilterDefinition struct {
	column    string
	sqlMapper func([]string) (func(int) (int, string), interface{}, error)
}

type Filterable interface {
	CheckFilter(string) bool
	GetSQLMapper(string) func([]string) (func(int) (int, string), interface{}, error)
}

type Selectable interface {
	Filterable
	GetPointerMap() map[string]interface{}
	GetColumns([]string) []string
	GetTableName() string
}
