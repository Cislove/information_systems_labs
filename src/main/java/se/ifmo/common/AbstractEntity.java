package se.ifmo.common;

public interface AbstractEntity<TId> {
    String getStringId();
    TId getId();
    void setId(TId id);
}
