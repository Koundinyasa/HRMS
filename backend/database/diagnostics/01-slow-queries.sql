/* =============================================================================
   01-slow-queries.sql   (READ ONLY: SELECT statements only, changes nothing)

   Purpose : evidence for the "why is the database slow" review (Stage 6).
   Run in : SSMS, connected to the HRMS database, ideally after a normal
            working day of use (the numbers below are counted since SQL Server
            last restarted or the plan was last cached).
   Needs  : VIEW SERVER STATE (ask the DBA if a query returns a permission error).
   Output : 12 result grids. Copy each grid (right-click > Copy with Headers)
            and paste them back in order, or use Query > Results To > File.
   ============================================================================= */
SET NOCOUNT ON;

/* 1. Database options that change performance */
SELECT name, compatibility_level, recovery_model_desc,
       is_auto_create_stats_on, is_auto_update_stats_on,
       is_auto_update_stats_async_on, is_read_committed_snapshot_on,
       is_query_store_on, is_parameterization_forced
FROM   sys.databases WHERE name = DB_NAME();

/* 2. Stored procedures that used the most total time */
SELECT TOP (20)
       OBJECT_NAME(ps.object_id, ps.database_id)                         AS proc_name,
       ps.execution_count,
       ps.total_elapsed_time / 1000                                      AS total_elapsed_ms,
       ps.total_elapsed_time / ps.execution_count / 1000                 AS avg_elapsed_ms,
       ps.total_worker_time  / ps.execution_count / 1000                 AS avg_cpu_ms,
       ps.total_logical_reads / ps.execution_count                       AS avg_logical_reads,
       ps.total_physical_reads / ps.execution_count                      AS avg_physical_reads,
       ps.last_execution_time, ps.cached_time
FROM   sys.dm_exec_procedure_stats ps
WHERE  ps.database_id = DB_ID()
ORDER  BY ps.total_elapsed_time DESC;

/* 3. Procedures that are slow per call (at least 5 calls) */
SELECT TOP (20)
       OBJECT_NAME(ps.object_id, ps.database_id)                         AS proc_name,
       ps.execution_count,
       ps.total_elapsed_time / ps.execution_count / 1000                 AS avg_elapsed_ms,
       ps.max_elapsed_time / 1000                                        AS max_elapsed_ms,
       ps.total_logical_reads / ps.execution_count                       AS avg_logical_reads
FROM   sys.dm_exec_procedure_stats ps
WHERE  ps.database_id = DB_ID() AND ps.execution_count >= 5
ORDER  BY ps.total_elapsed_time / ps.execution_count DESC;

/* 4. Statements that read the most pages (scans, key lookups show up here) */
SELECT TOP (20)
       OBJECT_NAME(st.objectid, st.dbid)                                 AS proc_name,
       qs.execution_count,
       qs.total_logical_reads / qs.execution_count                       AS avg_logical_reads,
       qs.total_elapsed_time / qs.execution_count / 1000                 AS avg_elapsed_ms,
       SUBSTRING(st.text, (qs.statement_start_offset / 2) + 1,
         ((CASE qs.statement_end_offset WHEN -1 THEN DATALENGTH(st.text)
           ELSE qs.statement_end_offset END - qs.statement_start_offset) / 2) + 1) AS statement_text
FROM   sys.dm_exec_query_stats qs
CROSS  APPLY sys.dm_exec_sql_text(qs.sql_handle) st
WHERE  st.dbid = DB_ID()
ORDER  BY qs.total_logical_reads DESC;

/* 5. Indexes SQL Server itself says are missing (a hint, not an order) */
SELECT TOP (20)
       OBJECT_NAME(mid.object_id, mid.database_id)                       AS table_name,
       CAST(migs.avg_user_impact AS decimal(5,1))                        AS est_improvement_pct,
       migs.user_seeks + migs.user_scans                                 AS times_wanted,
       mid.equality_columns, mid.inequality_columns, mid.included_columns,
       CAST(migs.avg_total_user_cost * migs.avg_user_impact
            * (migs.user_seeks + migs.user_scans) AS bigint)             AS score
FROM   sys.dm_db_missing_index_group_stats migs
JOIN   sys.dm_db_missing_index_groups  mig ON mig.index_group_handle = migs.group_handle
JOIN   sys.dm_db_missing_index_details mid ON mid.index_handle       = mig.index_handle
WHERE  mid.database_id = DB_ID()
ORDER  BY score DESC;

/* 6. Where the server waits (benign background waits removed) */
SELECT TOP (15) wait_type, waiting_tasks_count,
       wait_time_ms, signal_wait_time_ms
FROM   sys.dm_os_wait_stats
WHERE  wait_type NOT IN ('SLEEP_TASK','SLEEP_SYSTEMTASK','LAZYWRITER_SLEEP','SQLTRACE_BUFFER_FLUSH',
       'BROKER_TASK_STOP','BROKER_TO_FLUSH','BROKER_EVENTHANDLER','XE_TIMER_EVENT','XE_DISPATCHER_WAIT',
       'FT_IFTS_SCHEDULER_IDLE_WAIT','HADR_FILESTREAM_IOMGR_IOCOMPLETION','DIRTY_PAGE_POLL',
       'CHECKPOINT_QUEUE','REQUEST_FOR_DEADLOCK_SEARCH','LOGMGR_QUEUE','WAITFOR','DISPATCHER_QUEUE_SEMAPHORE',
       'SP_SERVER_DIAGNOSTICS_SLEEP','CLR_AUTO_EVENT','CLR_MANUAL_EVENT','SQLTRACE_INCREMENTAL_FLUSH_SLEEP',
       'QDS_PERSIST_TASK_MAIN_LOOP_SLEEP','QDS_CLEANUP_STALE_QUERIES_TASK_MAIN_LOOP_SLEEP','ONDEMAND_TASK_QUEUE',
       'BROKER_RECEIVE_WAITFOR','PREEMPTIVE_OS_AUTHENTICATIONOPS','PWAIT_ALL_COMPONENTS_INITIALIZED')
ORDER  BY wait_time_ms DESC;

/* 7. Biggest tables (rows) */
SELECT TOP (20) t.name AS table_name, SUM(p.rows) AS row_count
FROM   sys.tables t
JOIN   sys.partitions p ON p.object_id = t.object_id AND p.index_id IN (0, 1)
GROUP  BY t.name
ORDER  BY SUM(p.rows) DESC;

/* 8. Statistics that are old or have changed a lot since the last update */
SELECT TOP (25) OBJECT_NAME(s.object_id) AS table_name, s.name AS stat_name,
       sp.last_updated, sp.rows, sp.modification_counter
FROM   sys.stats s
CROSS  APPLY sys.dm_db_stats_properties(s.object_id, s.stats_id) sp
WHERE  OBJECTPROPERTY(s.object_id, 'IsUserTable') = 1 AND sp.modification_counter > 0
ORDER  BY sp.modification_counter DESC;

/* 9. Fragmented indexes on big tables (sampled, so it is quick) */
SELECT TOP (25) OBJECT_NAME(ips.object_id) AS table_name, i.name AS index_name,
       ips.index_type_desc, CAST(ips.avg_fragmentation_in_percent AS decimal(5,1)) AS frag_pct, ips.page_count
FROM   sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'SAMPLED') ips
JOIN   sys.indexes i ON i.object_id = ips.object_id AND i.index_id = ips.index_id
WHERE  ips.page_count > 1000 AND ips.avg_fragmentation_in_percent > 30 AND i.index_id > 0
ORDER  BY ips.page_count DESC;

/* 10. Code patterns that usually hurt: cursors and scalar functions used in procedures */
SELECT p.name AS proc_name,
       CASE WHEN d.definition LIKE '%CURSOR%'      THEN 1 ELSE 0 END AS uses_cursor,
       CASE WHEN d.definition LIKE '%dbo.fn[_]%' OR d.definition LIKE '%dbo.Fn[_]%' THEN 1 ELSE 0 END AS calls_scalar_fn,
       CASE WHEN d.definition LIKE '%WHILE%'       THEN 1 ELSE 0 END AS uses_while_loop
FROM   sys.procedures p
JOIN   sys.sql_modules d ON d.object_id = p.object_id
WHERE  d.definition LIKE '%CURSOR%' OR d.definition LIKE '%dbo.fn[_]%' OR d.definition LIKE '%dbo.Fn[_]%'
ORDER  BY p.name;

/* 11. Session tables: size and age (they grow on every refresh) */
SELECT 'AuthSessions' AS table_name, COUNT(*) AS row_count,
       MIN(CreatedAt) AS oldest, MAX(CreatedAt) AS newest,
       SUM(CASE WHEN RevokedAt IS NULL THEN 1 ELSE 0 END) AS open_rows
FROM   dbo.AuthSessions;

/* 12. Indexes that exist but are never read (write cost with no benefit) */
SELECT TOP (25) OBJECT_NAME(i.object_id) AS table_name, i.name AS index_name,
       us.user_seeks, us.user_scans, us.user_lookups, us.user_updates
FROM   sys.indexes i
LEFT   JOIN sys.dm_db_index_usage_stats us
       ON us.object_id = i.object_id AND us.index_id = i.index_id AND us.database_id = DB_ID()
WHERE  OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1 AND i.index_id > 1 AND i.is_primary_key = 0
  AND  ISNULL(us.user_seeks, 0) + ISNULL(us.user_scans, 0) + ISNULL(us.user_lookups, 0) = 0
ORDER  BY ISNULL(us.user_updates, 0) DESC;
