package api

import (
	"net/http"
	"time"
)

var lastModified *CacheTime

func resetCache() {
	cache := new(CacheTime)
	cache.Time = time.Now().Truncate(time.Second).UTC()

	lastModified = cache
}

type CacheTime struct {
	Time time.Time
}

func (cache CacheTime) Cache() string {
	return cache.Time.Format(http.TimeFormat)
}

func (cache CacheTime) IsAfter(modified string) bool {
	compare, err := http.ParseTime(modified)
	if err != nil {
		return true
	}
	return cache.Time.After(compare)
}
