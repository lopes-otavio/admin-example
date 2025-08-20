import React from "react"
import styles from "./styles.css"
import { TelevendaItem } from "../../../typings/types"
import { isExpired } from "../../../helpers/validations"

interface ConvertionCounterProps {
  televendas: TelevendaItem[]
}

export default function ConvertionCounter({ televendas = [] }: ConvertionCounterProps) {
  const safeTelevendas = televendas || []

  const televendasNaoExpiradas = safeTelevendas.filter((item) => !isExpired(item.datedoc))

  // Calcula as métricas de conversão usando apenas televendas não expiradas
  const totalTelevendas = safeTelevendas.length
  const televendasFinalizadas = safeTelevendas.filter(
    (item) => item.status === "finalizado" && item.approved,
  ).length

  const conversionRate = totalTelevendas > 0 ? ((televendasFinalizadas / totalTelevendas) * 100).toFixed(1) : "0.0"

  const televendasPendentes = televendasNaoExpiradas.filter(
    (item) => item.status !== "finalizado" || !item.approved,
  ).length

  return (
    <div className={styles.statsGrid}>
      {/* Card Total de Televendas */}
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Total de Televendas</span>
          <div className={`${styles.statIcon} ${styles.total}`}>T</div>
        </div>
        <div className={styles.statValue}>{totalTelevendas}</div>
        <div className={styles.statDescription}>
          Televendas criadas
        </div>
      </div>

      {/* Card Vendas Finalizadas */}
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Vendas Finalizadas</span>
          <div className={`${styles.statIcon} ${styles.converted}`}>✓</div>
        </div>
        <div className={styles.statValue}>{televendasFinalizadas}</div>
        <div className={styles.statDescription}>Televendas convertidas em vendas</div>
      </div>

      {/* Card Taxa de Conversão */}
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Taxa de Conversão</span>
          <div className={`${styles.statIcon} ${styles.rate}`}>%</div>
        </div>
        <div className={styles.statValue}>{conversionRate}%</div>
        <div className={styles.statDescription}>Percentual de conversão (ativos)</div>

        <div className={styles.progressContainer}>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>Progresso</span>
            <span className={styles.progressPercentage}>{conversionRate}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.min(Number.parseFloat(conversionRate), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Televendas Pendentes */}
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Pendentes</span>
          <div className={styles.statIcon} style={{ backgroundColor: "#fd7e14" }}>
            ⏳
          </div>
        </div>
        <div className={styles.statValue}>{televendasPendentes}</div>
        <div className={styles.statDescription}>Aguardando conversão (não expiradas)</div>
      </div>
    </div>
  )
}
