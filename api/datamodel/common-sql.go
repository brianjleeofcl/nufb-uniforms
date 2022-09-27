package datamodel

import (
	"errors"
	"fmt"
	"strconv"
)

func SQLBoolean(column string) func([]string) (func(int) (int, string), interface{}, error) {
	return func(s []string) (func(int) (int, string), interface{}, error) {
		if s[0] == "true" {
			return func(i int) (int, string) { return i, column }, nil, nil
		} else if s[0] != "false" {
			return nil, nil, errors.New("cannot parse as boolean")
		}

		return func(i int) (int, string) { return i, fmt.Sprintf("NOT %s", column) }, nil, nil
	}
}

func SQLStringEqual(column string) func([]string) (func(int) (int, string), interface{}, error) {
	return func(s []string) (func(int) (int, string), interface{}, error) {
		return func(i int) (int, string) {
			return i + 1, fmt.Sprintf("%s = $%d", column, i)
		}, s[0], nil
	}
}

func SQLNumberEqual(column string) func([]string) (func(int) (int, string), interface{}, error) {
	return func(s []string) (func(int) (int, string), interface{}, error) {
		num, err := strconv.Atoi(s[0])
		if err != nil {
			return nil, nil, err
		}
		return func(i int) (int, string) {
			return i + 1, fmt.Sprintf("%s = $%d", column, i)
		}, num, err
	}
}

func SQLNumberInequal(column string) func([]string) (func(int) (int, string), interface{}, error) {
	return func(s []string) (func(int) (int, string), interface{}, error) {
		num, err := strconv.Atoi(s[0])
		if err != nil {
			return nil, nil, err
		}
		sign := ">"
		if num < 0 {
			sign = "<"
			num = -num
		}
		return func(i int) (int, string) {
			return i + 1, fmt.Sprintf("%s %s $%d", column, sign, i)
		}, num, err
	}
}
