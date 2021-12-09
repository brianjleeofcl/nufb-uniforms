package datamodel

type Selectable interface {
	GetPointerMap() map[string]interface{}
	GetColumns([]string) []string
	GetTableName() string
}
