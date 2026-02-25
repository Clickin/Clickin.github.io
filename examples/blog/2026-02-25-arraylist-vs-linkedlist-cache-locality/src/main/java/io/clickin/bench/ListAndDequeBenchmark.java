package io.clickin.bench;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import org.openjdk.jmh.annotations.Benchmark;
import org.openjdk.jmh.annotations.BenchmarkMode;
import org.openjdk.jmh.annotations.Fork;
import org.openjdk.jmh.annotations.Level;
import org.openjdk.jmh.annotations.Measurement;
import org.openjdk.jmh.annotations.Mode;
import org.openjdk.jmh.annotations.OutputTimeUnit;
import org.openjdk.jmh.annotations.Param;
import org.openjdk.jmh.annotations.Scope;
import org.openjdk.jmh.annotations.Setup;
import org.openjdk.jmh.annotations.State;
import org.openjdk.jmh.annotations.Warmup;
import org.openjdk.jmh.infra.Blackhole;

@BenchmarkMode(Mode.AverageTime)
@OutputTimeUnit(TimeUnit.NANOSECONDS)
@Warmup(iterations = 5, time = 300, timeUnit = TimeUnit.MILLISECONDS)
@Measurement(iterations = 8, time = 300, timeUnit = TimeUnit.MILLISECONDS)
@Fork(1)
public class ListAndDequeBenchmark {

  @State(Scope.Thread)
  public static class ReadState {
    @Param({"1024", "8192", "65536"})
    public int size;

    public ArrayList<Integer> arrayList;
    public LinkedList<Integer> linkedList;
    public int middleIndex;
    public int firstValue;
    public int middleValue;
    public int lastValue;

    @Setup(Level.Trial)
    public void setUp() {
      arrayList = new ArrayList<>(size);
      linkedList = new LinkedList<>();
      for (int i = 0; i < size; i++) {
        arrayList.add(i);
        linkedList.add(i);
      }
      middleIndex = size / 2;
      firstValue = 0;
      middleValue = middleIndex;
      lastValue = size - 1;
    }
  }

  @State(Scope.Thread)
  public static class MutateState {
    @Param({"1024", "8192", "65536"})
    public int size;

    public ArrayList<Integer> arrayList;
    public LinkedList<Integer> linkedList;
    public int middleIndex;
    public int nextValue;

    @Setup(Level.Trial)
    public void setUp() {
      arrayList = new ArrayList<>(size);
      linkedList = new LinkedList<>();
      for (int i = 0; i < size; i++) {
        arrayList.add(i);
        linkedList.add(i);
      }
      middleIndex = size / 2;
      nextValue = size;
    }
  }

  @State(Scope.Thread)
  public static class DequeState {
    @Param({"1024", "8192", "65536"})
    public int size;

    public ArrayDeque<Integer> arrayDeque;
    public LinkedList<Integer> linkedDeque;
    public int nextValue;

    @Setup(Level.Trial)
    public void setUp() {
      arrayDeque = new ArrayDeque<>(size);
      linkedDeque = new LinkedList<>();
      for (int i = 0; i < size; i++) {
        arrayDeque.addLast(i);
        linkedDeque.addLast(i);
      }
      nextValue = size;
    }
  }

  @Benchmark
  public int arrayListGetMiddle(ReadState state) {
    return state.arrayList.get(state.middleIndex);
  }

  @Benchmark
  public int linkedListGetMiddle(ReadState state) {
    return state.linkedList.get(state.middleIndex);
  }

  @State(Scope.Thread)
  public static class BuildState {
    @Param({"1024", "8192", "65536"})
    public int size;

    public Object[] payload;

    @Setup(Level.Trial)
    public void setUp() {
      payload = new Object[size];
      for (int i = 0; i < size; i++) {
        payload[i] = new Object();
      }
    }
  }

  @Benchmark
  public int arrayListFindByValueFirst(ReadState state) {
    return findIndexByValue(state.arrayList, state.firstValue);
  }

  @Benchmark
  public int linkedListFindByValueFirst(ReadState state) {
    return findIndexByValue(state.linkedList, state.firstValue);
  }

  @Benchmark
  public int arrayListFindByValueMiddle(ReadState state) {
    return findIndexByValue(state.arrayList, state.middleValue);
  }

  @Benchmark
  public int linkedListFindByValueMiddle(ReadState state) {
    return findIndexByValue(state.linkedList, state.middleValue);
  }

  @Benchmark
  public int arrayListFindByValueLast(ReadState state) {
    return findIndexByValue(state.arrayList, state.lastValue);
  }

  @Benchmark
  public int linkedListFindByValueLast(ReadState state) {
    return findIndexByValue(state.linkedList, state.lastValue);
  }

  @Benchmark
  public void arrayListIterate(ReadState state, Blackhole blackhole) {
    for (int value : state.arrayList) {
      blackhole.consume(value);
    }
  }

  @Benchmark
  public void linkedListIterate(ReadState state, Blackhole blackhole) {
    for (int value : state.linkedList) {
      blackhole.consume(value);
    }
  }

  @Benchmark
  public int arrayListHeadInsertThenRemove(MutateState state) {
    state.arrayList.add(0, state.nextValue++);
    return state.arrayList.remove(0);
  }

  @Benchmark
  public int linkedListHeadInsertThenRemove(MutateState state) {
    state.linkedList.addFirst(state.nextValue++);
    return state.linkedList.removeFirst();
  }

  @Benchmark
  public int arrayListMiddleInsertThenRemove(MutateState state) {
    state.arrayList.add(state.middleIndex, state.nextValue++);
    return state.arrayList.remove(state.middleIndex);
  }

  @Benchmark
  public int linkedListMiddleInsertThenRemove(MutateState state) {
    state.linkedList.add(state.middleIndex, state.nextValue++);
    return state.linkedList.remove(state.middleIndex);
  }

  @Benchmark
  public int arrayListTailAddThenRemove(MutateState state) {
    state.arrayList.add(state.nextValue++);
    return state.arrayList.remove(state.arrayList.size() - 1);
  }

  @Benchmark
  public int linkedListTailAddThenRemove(MutateState state) {
    state.linkedList.addLast(state.nextValue++);
    return state.linkedList.removeLast();
  }

  @Benchmark
  public int arrayListIteratorRemoveAndRestore(MutateState state) {
    Iterator<Integer> iterator = state.arrayList.iterator();
    if (iterator.hasNext()) {
      int value = iterator.next();
      iterator.remove();
      state.arrayList.add(0, value);
      return value;
    }
    return -1;
  }

  @Benchmark
  public int linkedListIteratorRemoveAndRestore(MutateState state) {
    Iterator<Integer> iterator = state.linkedList.iterator();
    if (iterator.hasNext()) {
      int value = iterator.next();
      iterator.remove();
      state.linkedList.addFirst(value);
      return value;
    }
    return -1;
  }

  @Benchmark
  public int arrayDequeOfferLastPollFirst(DequeState state) {
    state.arrayDeque.addLast(state.nextValue++);
    return state.arrayDeque.pollFirst();
  }

  @Benchmark
  public int linkedListDequeOfferLastPollFirst(DequeState state) {
    state.linkedDeque.addLast(state.nextValue++);
    return state.linkedDeque.pollFirst();
  }

  @Benchmark
  public int arrayDequeOfferFirstPollLast(DequeState state) {
    state.arrayDeque.addFirst(state.nextValue++);
    return state.arrayDeque.pollLast();
  }

  @Benchmark
  public int linkedListDequeOfferFirstPollLast(DequeState state) {
    state.linkedDeque.addFirst(state.nextValue++);
    return state.linkedDeque.pollLast();
  }

  @Benchmark
  public int arrayListBuildFromPayload(BuildState state) {
    ArrayList<Object> list = new ArrayList<>(state.size);
    for (Object value : state.payload) {
      list.add(value);
    }
    return list.size();
  }

  @Benchmark
  public int linkedListBuildFromPayload(BuildState state) {
    LinkedList<Object> list = new LinkedList<>();
    for (Object value : state.payload) {
      list.add(value);
    }
    return list.size();
  }

  private static int findIndexByValue(List<Integer> list, int target) {
    int index = 0;
    for (int value : list) {
      if (value == target) {
        return index;
      }
      index++;
    }
    return -1;
  }
}
