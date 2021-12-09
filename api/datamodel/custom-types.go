package datamodel

import (
	"database/sql"
	"encoding/json"
)

type NullString struct {
	sql.NullString
}

func (s NullString) MarshalJSON() ([]byte, error) {
	if s.Valid {
		return json.Marshal(s.String)
	} else {
		return json.Marshal(nil)
	}
}

func (s *NullString) UnmarshalJSON(data []byte) error {
	var str *string
	if err := json.Unmarshal(data, &str); err != nil {
		return err
	}
	if str != nil {
		s.Valid = true
		s.String = *str
	} else {
		s.Valid = false
	}
	return nil
}

type NullInt32 struct {
	sql.NullInt32
}

func (i NullInt32) MarshalJSON() ([]byte, error) {
	if i.Valid {
		return json.Marshal(i.Int32)
	} else {
		return json.Marshal(nil)
	}
}

func (i *NullInt32) UnmarshalJSON(data []byte) error {
	var it *int32
	if err := json.Unmarshal(data, &it); err != nil {
		return err
	}
	if it != nil {
		i.Int32 = *it
		i.Valid = true
	} else {
		i.Valid = false
	}
	return nil
}

type NullBool struct {
	sql.NullBool
}

func (b NullBool) MarshalJSON() ([]byte, error) {
	if b.Valid {
		return json.Marshal(b.Bool)
	} else {
		return json.Marshal(nil)
	}
}

func (b *NullBool) UnmarshalJSON(data []byte) error {
	var bl *bool
	if err := json.Unmarshal(data, &bl); err != nil {
		return err
	}
	if bl != nil {
		b.Valid = true
		b.Bool = *bl
	} else {
		b.Valid = false
	}
	return nil
}
