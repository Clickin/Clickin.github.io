package io.clickin.bench;

import java.util.ArrayDeque;
import java.util.ArrayList;
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
  public static class ListState {
    @Param({"1000", "10000", "100000"})
    public int size;

    public List<Integer> arrayList;
    public List<Integer> linkedList;
    public int middleIndex;

    @Setup(Level.Trial)
    public void setUp() {
      arrayList = new ArrayList<>(size);
      linkedList = new LinkedList<>();
      for (int i = 0; i < size; i++) {
        arrayList.add(i);
        linkedList.add(i);
      }
      middleIndex = size / 2;
    }
  }

  @State(Scope.Thread)
  public static class DequeState {
    @Param({"1000", "10000"})
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
  public int arrayListGetMiddle(ListState state) {
    return state.arrayList.get(state.middleIndex);
  }

  @Benchmark
  public int linkedListGetMiddle(ListState state) {
    return state.linkedList.get(state.middleIndex);
  }

  @Benchmark
  public void arrayListIterate(ListState state, Blackhole blackhole) {
    for (int value : state.arrayList) {
      blackhole.consume(value);
    }
  }

  @Benchmark
  public void linkedListIterate(ListState state, Blackhole blackhole) {
    for (int value : state.linkedList) {
      blackhole.consume(value);
    }
  }

  @Benchmark
  public int arrayDequeOfferPoll(DequeState state) {
    state.arrayDeque.addLast(state.nextValue++);
    return state.arrayDeque.pollFirst();
  }

  @Benchmark
  public int linkedListDequeOfferPoll(DequeState state) {
    state.linkedDeque.addLast(state.nextValue++);
    return state.linkedDeque.pollFirst();
  }
}
