<template>
  <v-row>
    <v-col cols="12">
      <v-sheet class="calendar-container">
        <v-calendar
          ref="calendar"
          v-model="today"
          :events="processedEvents"
          color="primary"
          view-mode="week"
          :dark="false"
        >
          <template #event="{ event }">
            <div class="my-event" :data-color="event.color">
              <div class="event-header">
                <strong>{{ event.title }}</strong>
                <div class="event-meta">
                  {{ event.time }} • {{ event.location }}
                </div>
              </div>
              <div class="event-description" v-if="event.description">
                {{ event.description }}
              </div>
            </div>
          </template>
        </v-calendar>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed } from 'vue'

const calendar = ref(null)
const today = ref(new Date('2025-06-23'))

// Função para gerar eventos recorrentes
function generateRecurringEvents(baseEvent, options) {
  const { frequency, interval, endDate, exceptions = [] } = options
  const events = []
  let currentDate = new Date(baseEvent.start)
  
  while (currentDate <= endDate) {
    const eventDate = new Date(currentDate)
    const endTime = new Date(eventDate)
    endTime.setMinutes(endTime.getMinutes() + (baseEvent.end - baseEvent.start) / (1000 * 60))
    
    // Verifica se a data está nas exceções
    const isException = exceptions.some(ex => 
      ex.getTime() === eventDate.getTime()
    )
    
    if (!isException) {
      events.push({
        ...baseEvent,
        start: new Date(eventDate),
        end: new Date(endTime),
        time: `${formatTime(eventDate)} - ${formatTime(endTime)}`,
        location: baseEvent.location || ''
      })
    }
    
    // Avança para a próxima ocorrência
    if (frequency === 'daily') {
      currentDate.setDate(currentDate.getDate() + interval)
    } else if (frequency === 'weekly') {
      currentDate.setDate(currentDate.getDate() + 7 * interval)
    } else if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + interval)
    }
  }
  
  return events
}

// Formata hora no formato HH:MM
function formatTime(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Definição dos eventos base
const baseEvents = [
  {
    title: 'Matemática - Prof. João',
    start: new Date('2025-06-23T08:00:00'),
    end: new Date('2025-06-23T12:30:00'),
    description: 'Álgebra Linear',
    location: 'Sala 101',
    color: 'blue',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2025-12-19'),
      exceptions: [new Date('2025-07-14'), new Date('2025-09-07')]
    }
  },
  {
    title: 'Português - Prof. Ana',
    start: new Date('2025-06-24T10:00:00'),
    end: new Date('2025-06-24T11:30:00'),
    description: 'Interpretação de texto',
    location: 'Sala 102',
    color: 'green',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2025-12-19')
    }
  },
  {
    title: 'História - Prof. Carlos',
    start: new Date('2025-06-25T13:00:00'),
    end: new Date('2025-06-25T16:30:00'),
    description: 'Revolução Industrial',
    location: 'Sala 201',
    color: 'orange',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2025-12-19')
    }
  },
  {
    title: 'Química - Prof. Juliana',
    start: new Date('2025-06-26T15:00:00'),
    end: new Date('2025-06-26T16:30:00'),
    description: 'Reações Orgânicas',
    location: 'Sala 103',
    color: 'purple',
    recurring: {
      frequency: 'weekly',
      interval: 1,
      endDate: new Date('2025-12-19')
    }
  }
]

// Processa todos os eventos incluindo os recorrentes
const processedEvents = computed(() => {
  const allEvents = []
  
  baseEvents.forEach(event => {
    if (event.recurring) {
      const recurringEvents = generateRecurringEvents(event, event.recurring)
      allEvents.push(...recurringEvents)
    } else {
      allEvents.push({
        ...event,
        time: `${formatTime(event.start)} - ${formatTime(event.end)}`,
        location: event.location || ''
      })
    }
  })
  
  return allEvents
})
</script>

<style scoped lang="scss">
.calendar-container {
  background-color: white !important;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  :deep(.v-calendar) {
    background-color: #ffffff;
    color: #2a3d73;
    font-family: 'Roboto', sans-serif;
  }

  :deep(.v-calendar-weekly__day) {
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
  }

  :deep(.v-calendar-weekly__head) {
    background-color: #f5f5f5;
    font-weight: 500;
  }

  :deep(.v-calendar-weekly__day-label) {
    font-size: 14px;
  }

  :deep(.v-event) {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }

  /* [Mantenha todos os outros estilos do container...] */

  .my-event {
    background-color: #1867c0;
    color: #ffffff !important;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    overflow: hidden;
    white-space: normal;
    min-height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-left: 4px solid var(--event-color, #1867c0);
    margin: 2px 4px;
    transition: all 0.2s ease;

    .event-header {
      margin-bottom: 4px;
      
      strong {
        font-weight: 500;
        display: block;
        margin-bottom: 2px;
      }
      
      .event-meta {
        font-size: 10px;
        opacity: 0.9;
      }
    }

  .event-description {
      font-size: 11px;
      line-height: 1.3;
      padding-top: 4px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
      margin-top: 4px;
    }
  }
  .my-event:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  // Cores diferentes para cada tipo de evento
  .my-event[data-color="blue"] {
    --event-color: #2196F3;
    background-color: #2196F3;
  }
  .my-event[data-color="green"] {
    --event-color: #4CAF50;
    background-color: #4CAF50;
  }
  .my-event[data-color="orange"] {
    --event-color: #FF9800;
    background-color: #FF9800;
  }
  .my-event[data-color="purple"] {
    --event-color: #9C27B0;
    background-color: #9C27B0;
  }
}
</style>