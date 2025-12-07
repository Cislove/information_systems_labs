package se.ifmo.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Repository
public interface ImportHistoryRepository extends JpaRepository<ImportHistory, Integer> {

    @Query("SELECT ih FROM ImportHistory ih " +
            "ORDER BY ih.importTime DESC " +
            "LIMIT :n ")
    List<ImportHistory> getLastImports(int n);
}
